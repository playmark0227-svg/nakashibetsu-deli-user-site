-- 全ての女の子の閲覧数を0にリセット
UPDATE girls SET view_count = 0;

-- 確認用：リセット後の閲覧数を表示
SELECT id, name, view_count FROM girls ORDER BY name;
