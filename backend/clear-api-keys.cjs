const initSqlJs = require('sql.js');
const fs = require('fs');

async function clearApiKeys() {
  const SQL = await initSqlJs();
  const db = new SQL.Database(fs.readFileSync('data/bazi.db'));
  
  db.run('UPDATE settings SET api_key = ""');
  db.run('DELETE FROM settings WHERE api_key IS NULL OR api_key = ""');
  
  fs.writeFileSync('data/bazi.db', db.export());
  console.log('已清空所有 API keys');
  
  db.close();
}

clearApiKeys().catch(console.error);
