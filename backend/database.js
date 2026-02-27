const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'pawnshop.db');
const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT, id_number TEXT UNIQUE NOT NULL)`);
  db.run(`CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, name TEXT NOT NULL, description TEXT, photo_path TEXT, loan_amount REAL NOT NULL, loan_date TEXT NOT NULL, expiry_date TEXT NOT NULL, FOREIGN KEY (customer_id) REFERENCES customers (id))`);
});
module.exports = db;
