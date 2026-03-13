const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Get dashboard analytics
router.get('/dashboard', (req, res) => {
  const { business_id } = req.query;
  
  // Total businesses
  db.get('SELECT COUNT(*) as total_businesses FROM businesses', [], (err, businessCount) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Total customers
    db.get('SELECT COUNT(*) as total_customers FROM customers', [], (err, customerCount) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Total appointments
      db.get('SELECT COUNT(*) as total_appointments FROM appointments', [], (err, appointmentCount) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Appointments this week
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        
        db.get(`SELECT COUNT(*) as appointments_this_week FROM appointments 
                WHERE created_at >= ?`, [startOfWeek.toISOString()], (err, weeklyCount) => {
          if (err) return res.status(500).json({ error: err.message });
          
          // Confirmed vs cancelled
          db.get(`SELECT 
            SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
            SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
            COUNT(*) as total
          FROM appointments`, [], (err, statusCount) => {
            if (err) return res.status(500).json({ error: err.message });
            
            // SMS analytics
            db.get(`SELECT 
              COUNT(*) as total_sms,
              SUM(CASE WHEN action = 'confirmed' THEN 1 ELSE 0 END) as sms_confirmed,
              SUM(CASE WHEN action = 'cancelled' THEN 1 ELSE 0 END) as sms_cancelled
            FROM analytics`, [], (err, smsCount) => {
              if (err) return res.status(500).json({ error: err.message });
              
              res.json({
                businesses: businessCount.total_businesses,
                customers: customerCount.total_customers,
        appointments: appointmentCount.total_appointments,
        appointments_this_week: weeklyCount.appointments_this_week,
                confirmed: statusCount.confirmed || 0,
        cancelled: statusCount.cancelled || 0,
                sms_sent: smsCount.total_sms || 0,
        sms_confirmed: smsCount.sms_confirmed || 0,
        sms_cancelled: smsCount.sms_cancelled || 0
              });
            });
          });
        });
      });
    });
  });
});

// Get appointments by day
router.get('/appointments-by-day', (req, res) => {
  const { business_id } = req.query;
  
  db.all(`SELECT 
    DATE(a.appointment_datetime) as date,
    COUNT(*) as total_appointments,
    SUM(CASE WHEN a.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
    SUM(CASE WHEN a.status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
  FROM appointments a
  GROUP BY DATE(a.appointment_datetime)
  ORDER BY date DESC
  LIMIT 30`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get analytics by business
router.get('/by-business', (req, res) => {
  db.all(`SELECT 
    b.name,
    COUNT(DISTINCT c.id) as total_customers,
    COUNT(DISTINCT a.id) as total_appointments
  FROM businesses b
  LEFT JOIN customers c ON b.id = c.business_id
  LEFT JOIN appointments a ON b.id = a.business_id
  GROUP BY b.id, b.name`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
