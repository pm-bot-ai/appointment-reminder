const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Get all businesses
router.get('/', (req, res) => {
  db.all('SELECT * FROM businesses ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get business by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM businesses WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(row);
  });
});

// Create business
router.post('/', (req, res) => {
  const { name, email, phone, address, timezone, twilio_phone_number, twilio_account_sid, twilio_auth_token } = req.body;
  
  const sql = `INSERT INTO businesses (name, email, phone, address, timezone, twilio_phone_number, twilio_account_sid, twilio_auth_token)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [name, email, phone, address, timezone || 'America/New_York', twilio_phone_number, twilio_account_sid, twilio_auth_token], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, name, email, phone, address, timezone: timezone || 'America/New_York', twilio_phone_number, twilio_account_sid, twilio_auth_token });
  });
});

// Update business
router.put('/:id', (req, res) => {
  const { name, email, phone, address, timezone, twilio_phone_number, twilio_account_sid, twilio_auth_token } = req.body;
  
  const sql = `UPDATE businesses SET name = ?, email = ?, phone = ?, address = ?, timezone = ?, twilio_phone_number = ?, twilio_account_sid = ?, twilio_auth_token = ? WHERE id = ?`;
  
  db.run(sql, [name, email, phone, address, timezone || 'America/New_York', twilio_phone_number, twilio_account_sid, twilio_auth_token, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json({ id: req.params.id, name, email, phone, address, timezone: timezone || 'America/New_York', twilio_phone_number, twilio_account_sid, twilio_auth_token });
  });
});

// Delete business
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM businesses WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json({ message: 'Business deleted successfully' });
  });
});

module.exports = router;
