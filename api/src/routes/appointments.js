const express = require('express');
const router = express.Router();
const { db } = require('../db');
const sms = require('../sms');

// Get all appointments
router.get('/', (req, res) => {
  db.all(`SELECT a.*, b.name as business_name, c.name as customer_name 
           FROM appointments a 
           JOIN businesses b ON a.business_id = b.id 
           JOIN customers c ON a.customer_id = c.id 
           ORDER BY a.appointment_datetime DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get appointments by business ID
router.get('/business/:businessId', (req, res) => {
  const { businessId } = req.params;
  
  db.all(`SELECT a.*, c.name as customer_name 
           FROM appointments a 
           JOIN customers c ON a.customer_id = c.id 
           WHERE a.business_id = ? 
           ORDER BY a.appointment_datetime DESC`, [businessId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get appointments by date range
router.get('/date-range', (req, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required' });
  }
  
  db.all(`SELECT a.*, c.name as customer_name, b.name as business_name 
           FROM appointments a 
           JOIN customers c ON a.customer_id = c.id 
           JOIN businesses b ON a.business_id = b.id 
           WHERE DATE(a.appointment_datetime) BETWEEN ? AND ? 
           ORDER BY a.appointment_datetime ASC`, [startDate, endDate], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get appointment by ID
router.get('/:id', (req, res) => {
  db.get(`SELECT a.*, c.name as customer_name, b.name as business_name 
           FROM appointments a 
           JOIN customers c ON a.customer_id = c.id 
           JOIN businesses b ON a.business_id = b.id 
           WHERE a.id = ?`, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(row);
  });
});

// Create appointment
router.post('/', (req, res) => {
  const { business_id, customer_id, service, appointment_datetime, status, reminder_time_hours } = req.body;
  
  const sql = `INSERT INTO appointments (business_id, customer_id, service, appointment_datetime, status, reminder_time_hours)
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [business_id, customer_id, service, appointment_datetime, status || 'scheduled', reminder_time_hours || 24], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Get the created appointment
    db.get(`SELECT a.*, c.name as customer_name, b.name as business_name 
             FROM appointments a 
             JOIN customers c ON a.customer_id = c.id 
             JOIN businesses b ON a.business_id = b.id 
             WHERE a.id = ?`, [this.lastID], (err, appointment) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Send SMS reminder if Twilio is configured
      if (appointment.business_name && appointment.customer_id) {
        db.get('SELECT * FROM businesses WHERE id = ?', [business_id], (err, business) => {
          if (!err && business.twilio_account_sid && business.twilio_auth_token) {
            sms.initTwilio({
              accountSid: business.twilio_account_sid,
              authToken: business.twilio_auth_token
            });
            
            // Format date for SMS
            const date = new Date(appointment.appointment_datetime);
            const appointmentDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            const appointmentTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            
            sms.sendReminder(appointment.customer_id, business.name || business_name, appointmentDate, appointmentTime)
              .then((smsResponse) => {
                console.log('SMS sent:', smsResponse.sid);
              })
              .catch((smsErr) => {
                console.error('SMS error:', smsErr.message);
              });
          }
        });
      }
      
      res.json({ id: this.lastID, ...appointment });
    });
  });
});

// Update appointment
router.put('/:id', (req, res) => {
  const { business_id, customer_id, service, appointment_datetime, status, reminder_time_hours } = req.body;
  
  const sql = `UPDATE appointments SET business_id = ?, customer_id = ?, service = ?, appointment_datetime = ?, status = ?, reminder_time_hours = ? WHERE id = ?`;
  
  db.run(sql, [business_id, customer_id, service, appointment_datetime, status, reminder_time_hours, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    db.get(`SELECT a.*, c.name as customer_name, b.name as business_name 
             FROM appointments a 
             JOIN customers c ON a.customer_id = c.id 
             JOIN businesses b ON a.business_id = b.id 
             WHERE a.id = ?`, [req.params.id], (err, appointment) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(appointment);
    });
  });
});

// Delete appointment
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM appointments WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  });
});

// Confirm appointment via SMS
router.post('/:id/confirm', (req, res) => {
  const { confirmation } = req.body;
  
  if (!['confirmed', 'cancelled'].includes(confirmation)) {
    return res.status(400).json({ error: 'Confirmation must be "confirmed" or "cancelled"' });
  }
  
  db.run('UPDATE appointments SET status = ? WHERE id = ?', [confirmation, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    db.get('SELECT * FROM appointments WHERE id = ?', [req.params.id], (err, appointment) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      db.run('INSERT INTO analytics (business_id, appointment_id, action, timestamp) VALUES (?, ?, ?, ?)', 
        [appointment.business_id, req.params.id, confirmation, new Date().toISOString()]);
      
      res.json({ id: req.params.id, status: confirmation });
    });
  });
});

module.exports = router;
