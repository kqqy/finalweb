var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// 引入 db.js 並確認資料庫連線
const db = require('./db');

db.serialize(() => {
  db.get('SELECT 1', (err) => {
    if (err) {
      console.error('無法連接到 SQLite 資料庫:', err.message);
    } else {
      console.log('已成功連接到 SQLite 資料庫。');
    }
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 新增 /search 路由，回傳 search.html
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});
// 新增 /buy 路由，回傳 buy.html
app.get('/buy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'buy.html'));
});

// /api/price 路由，查詢 salmon table 所有的平均價格 及 交易量
app.get('/api/price', (req, res) => {
  db.all('SELECT year, average_price, volume FROM salmon', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '查詢失敗', details: err.message });
    }
    res.json(rows);
  });
});

// /api?year= 路由，查詢 salmon table 某 year 的所有資料
app.get('/api', (req, res) => {
  const year = req.query.year;
  if (!year) {
    return res.status(400).json({ error: '請提供 year 參數' });
  }
  db.get('SELECT * FROM salmon WHERE year = ?', [year], (err, row) => {
    if (err) {
      return res.status(500).json({ error: '查詢失敗', details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: '查無資料' });
    }
    res.json(row);
  });
});

// 查詢自訂區間的鮭魚資料
app.get('/api/price/range', (req, res) => {
  const start = parseInt(req.query.start, 10);
  const end = parseInt(req.query.end, 10);
  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ error: '請提供正確的起始年與結束年' });
  }
  db.all('SELECT * FROM salmon WHERE year >= ? AND year <= ? ORDER BY year', [start, end], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '查詢失敗', details: err.message });
    }
    res.json(rows);
  });
});

module.exports = app;
