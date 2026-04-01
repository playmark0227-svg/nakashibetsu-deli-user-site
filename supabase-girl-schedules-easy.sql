-- キャスト出勤スケジュール管理テーブル
-- リアルタイムの出勤状況・ソク姫対応状況を管理

-- 既存のテーブルがあれば削除（開発環境のみ）
-- DROP TABLE IF EXISTS girl_schedules CASCADE;

CREATE TABLE IF NOT EXISTS girl_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  girl_id TEXT NOT NULL,
  shop_id TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- 出勤状況
  status TEXT NOT NULL DEFAULT 'unknown', 
  -- 'working' (出勤中), 'scheduled' (出勤予定), 'off' (本日休み), 'unknown' (未定)
  
  -- ソク姫対応可否
  instant_available BOOLEAN DEFAULT false,
  
  -- 時間情報
  start_time TIME, -- 出勤時間
  end_time TIME,   -- 退勤時間
  
  -- 備考
  notes TEXT, -- 「20:00以降限定」「電話予約のみ」など
  
  -- メタ情報
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT, -- 更新者（店舗ID or 管理者）
  
  -- ユニーク制約: 1人のキャストは1日1レコードのみ
  UNIQUE(girl_id, date)
);

-- インデックス作成（検索高速化）
CREATE INDEX IF NOT EXISTS idx_girl_schedules_girl_id ON girl_schedules(girl_id);
CREATE INDEX IF NOT EXISTS idx_girl_schedules_shop_id ON girl_schedules(shop_id);
CREATE INDEX IF NOT EXISTS idx_girl_schedules_date ON girl_schedules(date);
CREATE INDEX IF NOT EXISTS idx_girl_schedules_status ON girl_schedules(status);
CREATE INDEX IF NOT EXISTS idx_girl_schedules_instant ON girl_schedules(instant_available);

-- 更新日時を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_girl_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_girl_schedules_updated_at ON girl_schedules;

CREATE TRIGGER trigger_update_girl_schedules_updated_at
BEFORE UPDATE ON girl_schedules
FOR EACH ROW
EXECUTE FUNCTION update_girl_schedules_updated_at();

-- RLS (Row Level Security) 設定 - 緩和版
ALTER TABLE girl_schedules ENABLE ROW LEVEL SECURITY;

-- 全員が読み取り・書き込み可能（開発環境用）
DROP POLICY IF EXISTS "Everyone can view girl schedules" ON girl_schedules;
DROP POLICY IF EXISTS "Everyone can insert schedules" ON girl_schedules;
DROP POLICY IF EXISTS "Everyone can update schedules" ON girl_schedules;
DROP POLICY IF EXISTS "Everyone can delete schedules" ON girl_schedules;

CREATE POLICY "Everyone can view girl schedules"
ON girl_schedules FOR SELECT
USING (true);

CREATE POLICY "Everyone can insert schedules"
ON girl_schedules FOR INSERT
WITH CHECK (true);

CREATE POLICY "Everyone can update schedules"
ON girl_schedules FOR UPDATE
USING (true);

CREATE POLICY "Everyone can delete schedules"
ON girl_schedules FOR DELETE
USING (true);

-- 本日の出勤中キャストを取得するビュー
DROP VIEW IF EXISTS today_working_girls;

CREATE OR REPLACE VIEW today_working_girls AS
SELECT 
  g.*,
  s.status,
  s.instant_available,
  s.start_time,
  s.end_time,
  s.notes as schedule_notes,
  s.updated_at as status_updated_at
FROM girls g
LEFT JOIN girl_schedules s ON g.id = s.girl_id AND s.date = CURRENT_DATE
WHERE s.status = 'working'
ORDER BY s.instant_available DESC, s.start_time ASC;

-- 今すぐ遊べるキャスト（ソク姫OK）を取得するビュー
DROP VIEW IF EXISTS instant_available_girls;

CREATE OR REPLACE VIEW instant_available_girls AS
SELECT 
  g.*,
  s.status,
  s.instant_available,
  s.start_time,
  s.end_time,
  s.notes as schedule_notes,
  s.updated_at as status_updated_at
FROM girls g
INNER JOIN girl_schedules s ON g.id = s.girl_id AND s.date = CURRENT_DATE
WHERE s.status = 'working' AND s.instant_available = true
ORDER BY s.updated_at DESC;

COMMENT ON TABLE girl_schedules IS 'キャスト出勤スケジュール・リアルタイム状況管理';
COMMENT ON COLUMN girl_schedules.status IS '出勤状況: working(出勤中), scheduled(出勤予定), off(休み), unknown(未定)';
COMMENT ON COLUMN girl_schedules.instant_available IS 'ソク姫対応可否: true=今すぐ遊べる, false=予約のみ';
COMMENT ON COLUMN girl_schedules.start_time IS '出勤開始時間';
COMMENT ON COLUMN girl_schedules.end_time IS '退勤時間';
COMMENT ON COLUMN girl_schedules.notes IS '備考（店舗スタッフが入力）';

-- 完了メッセージ
SELECT 'girl_schedules table created successfully with relaxed RLS policies!' as result;
