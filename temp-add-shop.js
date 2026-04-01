const https = require('https');

const shopData = {
  login_id: 'hitozuma',
  password: 'shop123',
  name: 'りある人妻の品格中標津〔幼妻、若妻、熟妻〕',
  description: '人妻専門店。幼妻・若妻・熟妻と幅広い年齢層の魅力的な人妻が在籍。上質な大人の時間をお約束します。',
  address: '中標津町',
  phone: '0153-XX-XXXX',
  business_hours: '10:00-24:00',
  area: '中標津'
};

console.log('店舗データ:', JSON.stringify(shopData, null, 2));
console.log('\n以下のSQLをSupabaseで実行してください：\n');
console.log(`INSERT INTO shops (login_id, password, name, description, address, phone, business_hours, area)
VALUES (
  '${shopData.login_id}',
  '${shopData.password}',
  '${shopData.name}',
  '${shopData.description}',
  '${shopData.address}',
  '${shopData.phone}',
  '${shopData.business_hours}',
  '${shopData.area}'
);`);
