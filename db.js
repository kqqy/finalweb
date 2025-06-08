const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'db');
const dbPath = path.join(dbDir, 'sqlite.db');

// 確保 db 目錄存在
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// 檢查資料庫檔案是否存在
const dbExists = fs.existsSync(dbPath);

// 開啟資料庫
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('無法開啟資料庫:', err.message);
  } else {
    if (!dbExists) {
      console.log('資料庫不存在，已建立新資料庫。');
    } else {
      console.log('成功開啟資料庫。');
    }
    // 檢查 salmon table 是否存在，若不存在則建立
    db.run(`CREATE TABLE IF NOT EXISTS salmon (
      year INTEGER PRIMARY KEY NOT NULL,
      average_price DECIMAL(4,1) NOT NULL,
      volume DECIMAL(7,1) NOT NULL
    )`, (tableErr) => {
      if (tableErr) {
        console.error('建立 salmon table 時發生錯誤:', tableErr.message);
      } else {
        console.log('已確認 salmon table 存在。');
        // 新增 salmon table 資料
        const salmonData = [
          { year: 94, average_price: 153, volume: 303418.7 },
          { year: 95, average_price: 152, volume: 364536.8 },
          { year: 96, average_price: 151.8, volume: 477734.7 },
          { year: 97, average_price: 193.5, volume: 290652.2 },
          { year: 98, average_price: 194.8, volume: 36804.8 },
          { year: 99, average_price: 200.6, volume: 22235.2 },
          { year: 100, average_price: 218.1, volume: 107613.7 },
          { year: 101, average_price: 214.6, volume: 182702.2 },
          { year: 102, average_price: 220.6, volume: 142176.9 },
          { year: 103, average_price: 241.2, volume: 223467.5 },
          { year: 104, average_price: 246.4, volume: 259954.1 },
          { year: 105, average_price: 310.1, volume: 350479.6 },
          { year: 106, average_price: 312.9, volume: 631712.7 },
          { year: 107, average_price: 317.5, volume: 617644.6 },
          { year: 108, average_price: 318.8, volume: 608983.2 },
          { year: 109, average_price: 296, volume: 654121.6 },
          { year: 110, average_price: 294.8, volume: 705446.7 },
          { year: 111, average_price: 298.4, volume: 859875.7 },
          { year: 112, average_price: 305.3, volume: 871085.4 },
          { year: 113, average_price: 312.7, volume: 903772.8 },
          { year: 114, average_price: 312.9, volume: 348406.8 }
        ];
        salmonData.forEach(row => {
          db.run(
            'INSERT OR IGNORE INTO salmon (year, average_price, volume) VALUES (?, ?, ?)',
            [row.year, row.average_price, row.volume],
            (insertErr) => {
              if (insertErr) {
                console.error(`新增 year=${row.year} 時發生錯誤:`, insertErr.message);
              }
            }
          );
        });
      }
    });
  }
});

module.exports = db;

