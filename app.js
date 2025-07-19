const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

const sendMail = (toEmail, name) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Solar Consulting" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Xác nhận yêu cầu tư vấn",
    text: `Xin chào ${name}, chúng tôi đã nhận được yêu cầu tư vấn của bạn. Cảm ơn bạn!`
  };

  return transporter.sendMail(mailOptions);
};

app.post('/api/contact', (req, res) => {
  const { name, email, phone, address, note } = req.body;

  const sql = \`INSERT INTO customers (name, email, phone, address, note) VALUES (?, ?, ?, ?, ?)\`;
  db.query(sql, [name, email, phone, address, note], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    await sendMail(email, name);
    res.json({ message: 'Thông tin đã được gửi và lưu lại.' });
  });
});

app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM customers ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.listen(5000, () => console.log('Server running on port 5000'));
