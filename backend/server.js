const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./database');
const dayjs = require('dayjs');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend/dist')));
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
app.post('/api/customers', (req, res) => {
  const { name, phone, id_number } = req.body;
  if (!name || !id_number) return res.status(400).json({ error: 'Name and ID number are required' });
  db.run('INSERT INTO customers (name, phone, id_number) VALUES (?, ?, ?)', [name, phone, id_number], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});
app.get('/api/items', (req, res) => {
  const query = 'SELECT items.*, customers.name as customer_name, customers.phone as customer_phone FROM items JOIN customers ON items.customer_id = customers.id';
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const processed = rows.map(item => {
      const monthlyInterest = item.loan_amount * 0.02;
      const daysLeft = dayjs(item.expiry_date).diff(dayjs(), 'day');
      return { ...item, monthly_interest: monthlyInterest, days_left: daysLeft, is_alert: daysLeft < 5 };
    });
    res.json(processed);
  });
});
app.post('/api/items', upload.single('photo'), (req, res) => {
  const { customer_id, name, description, loan_amount, loan_date, expiry_date } = req.body;
  const photo_path = req.file ? `/uploads/${req.file.filename}` : null;
  if (!customer_id || !name || !loan_amount || !loan_date || !expiry_date) return res.status(400).json({ error: 'Missing required fields' });
  db.run('INSERT INTO items (customer_id, name, description, photo_path, loan_amount, loan_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)', [customer_id, name, description, photo_path, loan_amount, loan_date, expiry_date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});
app.get('/api/dashboard', (req, res) => {
  const query = 'SELECT items.*, customers.name as customer_name FROM items JOIN customers ON items.customer_id = customers.id';
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const alerts = rows.filter(item => dayjs(item.expiry_date).diff(dayjs(), 'day') < 5);
    res.json({ total_items: rows.length, alert_count: alerts.length, alerts: alerts.map(item => ({ ...item, days_left: dayjs(item.expiry_date).diff(dayjs(), 'day') })) });
  });
});
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/dist/index.html')));
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
