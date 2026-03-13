const express = require('express');
const router = express.Router();
const { db } = require('../db');
const crypto = require('crypto');

// Verify Twilio webhook signature
function verifySignature(sig, url, body) {
  const expected = crypto.createHmac('sha256', process.env.TWILIO_AUTH_TOKEN)
    .update(url + Buffer.from(JSON.stringify(body)).toString())
    .digest('hex');
  return sig === expected;
}

// Twilio SMS webhook
router.post('/twilio/incoming', (req, res) => {
  const { Body, From } = req.body;
  
  // Extract confirmation (YES/NO) and appointment ID
  const body = Body.toUpperCase().trim();
  
  let responseMessage = 'Thank you for your response.';
  
  if (body.includes('YES')) {
    // Look for appointment ID in message or use most recent
    const match = body.match(/(?:appointment|ID|ID:)\s*(\d+)/i);
    const appointmentId = match ? parseInt(match[1]) : null;
    
    if (appointmentId) {
      db.run('UPDATE appointments SET status = ? WHERE id = ?', ['confirmed', appointmentId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        db.run('INSERT INTO analytics (action, timestamp) VALUES (?, ?)', ['confirmed', new Date().toISOString()]);
        
        responseMessage = 'Appointment confirmed! We look forward to seeing you.';
      });
    } else {
      // Find most recent pending appointment for this phone
      db.get(`SELECT a.id FROM appointments a 
               JOIN customers c ON a.customer_id = c.id 
               WHERE c.phone = ? AND a.status = 'scheduled' 
               ORDER BY a.appointment_datetime DESC LIMIT 1`, [From], (err, appointment) => {
        if (appointment) {
          db.run('UPDATE appointments SET status = ? WHERE id = ?', ['confirmed', appointment.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            db.run('INSERT INTO analytics (action, timestamp) VALUES (?, ?)', ['confirmed', new Date().toISOString()]);
            
            responseMessage = 'Appointment confirmed! We look forward to seeing you.';
          });
        } else {
          responseMessage = 'We received your confirmation. If this is in error, please contact us.';
        }
      });
    }
  } else if (body.includes('NO') || body.includes('CANCEL')) {
    // Look for appointment ID in message
    const match = body.match(/(?:appointment|ID|ID:)\s*(\d+)/i);
    const appointmentId = match ? parseInt(match[1]) : null;
    
    if (appointmentId) {
      db.run('UPDATE appointments SET status = ? WHERE id = ?', ['cancelled', appointmentId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        db.run('INSERT INTO analytics (action, timestamp) VALUES (?, ?)', ['cancelled', new Date().toISOString()]);
        
        responseMessage = 'Your appointment has been cancelled.';
      });
    } else {
      // Find most recent pending appointment for this phone
      db.get(`SELECT a.id FROM appointments a 
               JOIN customers c ON a.customer_id = c.id 
               WHERE c.phone = ? AND a.status = 'scheduled' 
               ORDER BY a.appointment_datetime DESC LIMIT 1`, [From], (err, appointment) => {
        if (appointment) {
          db.run('UPDATE appointments SET status = ? WHERE id = ?', ['cancelled', appointment.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            db.run('INSERT INTO analytics (action, timestamp) VALUES (?, ?)', ['cancelled', new Date().toISOString()]);
            
            responseMessage = 'Your appointment has been cancelled.';
          });
        } else {
          responseMessage = 'Appointment cancellation request received. Please contact us to reschedule.';
        }
      });
    }
  } else {
    responseMessage = 'Please reply YES to confirm or NO to cancel your appointment.';
  }
  
  // Send auto-response
  const twilioResponse = `
    <?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Message>${responseMessage}</Message>
    </Response>
  `;
  
  res.setHeader('Content-Type', 'text/xml');
  res.send(twilioResponse);
});

// Webhook for incoming Twilio status updates
router.post('/twilio/status-update', (req, res) => {
  const { SmsSid, SmsStatus, ErrorCode } = req.body;
  
  if (SmsSid) {
    db.run('INSERT OR REPLACE INTO analytics (sms_sid, action, timestamp) VALUES (?, ?, ?)', 
      [SmsSid, SmsStatus || 'delivered', new Date().toISOString()]);
  }
  
  res.status(200).send('OK');
});

module.exports = router;
