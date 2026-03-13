const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Get all customers
router.get('/', (req, res) => {
  db.all(`SELECT c.*, b.name as business_name 
           FROM customers c 
           JOIN businesses b ON c.business_id = b.id 
           ORDER BY c.created_at DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get customers by business ID
router.get('/business/:businessId', (req, res) => {
  db.all('SELECT * FROM customers WHERE business_id = ?', [req.params.businessId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get customer by ID
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM customers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(row);
  });
});

// Create customer
router.post('/', (req, res) => {
  const { business_id, name, email, phone, notes } = req.body;
  
  const sql = `INSERT INTO customers (business_id, name, email, phone, notes)
               VALUES (?, ?, ?, ?, ?)`;
  
  db.run(sql, [business_id, name, email, phone, notes], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, business_id, name, email, phone, notes });
  });
});

// Update customer
router.put('/:id', (req, res) => {
  const { business_id, name, email, phone, notes } = req.body;
  
  const sql = `UPDATE customers SET business_id = ?, name = ?, email = ?, phone = ?, notes = ? WHERE id = ?`;
  
  db.run(sql, [business_id, name, email, phone, notes, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ id: req.params.id, business_id, name, email, phone, notes });
  });
});

// Delete customer
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM customers WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully' });
  });
});

module.exports = router;
