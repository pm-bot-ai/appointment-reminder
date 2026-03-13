const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file
const DB_PATH = path.join(__dirname, '..', 'database.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH);

// Initialize tables
function initDB() {
  return new Promise((resolve, reject) => {
    // Businesses table
    db.run(`
      CREATE TABLE IF NOT EXISTS businesses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        timezone TEXT DEFAULT 'America/New_York',
        twilio_phone_number TEXT,
        twilio_account_sid TEXT,
        twilio_auth_token TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Customers table
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        business_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL UNIQUE,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES businesses(id)
      )
    `);

    // Appointments table
    db.run(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        business_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        service TEXT NOT NULL,
        appointment_datetime DATETIME NOT NULL,
        status TEXT DEFAULT 'scheduled',
        reminder_time_hours INTEGER DEFAULT 24,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES businesses(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      )
    `);

    // Analytics table for tracking reminders sent
    db.run(`
      CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        business_id INTEGER NOT NULL,
        appointment_id INTEGER,
        action TEXT NOT NULL,
        sms_sid TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (business_id) REFERENCES businesses(id),
        FOREIGN KEY (appointment_id) REFERENCES appointments(id)
      )
    `);

    resolve();
  });
}

// Export
module.exports = { db, initDB };
