const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkData() {
  console.log('📊 データベース内の実データ確認\n');
  
  // 店舗数
  const { data: shops, error: shopsError } = await supabase
    .from('shops')
    .select('id, name');
  
  if (!shopsError) {
    console.log(`🏪 登録店舗数: ${shops.length}店`);
    shops.forEach((shop, i) => {
      console.log(`   ${i+1}. ${shop.name}`);
    });
  }
  
  console.log('');
  
  // キャスト数
  const { data: girls, error: girlsError } = await supabase
    .from('girls')
    .select('id, name, is_new');
  
  if (!girlsError) {
    console.log(`👧 総キャスト数: ${girls.length}名`);
    const newGirls = girls.filter(g => g.is_new);
    console.log(`✨ 新人キャスト数: ${newGirls.length}名`);
  }
  
  console.log('\n✅ これらの実数値がサイトに表示されます！');
}

checkData();
