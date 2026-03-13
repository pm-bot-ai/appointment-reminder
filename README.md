# AppointReminder

A comprehensive appointment reminder system built with Express.js (backend) and React + Vite (frontend). Features SMS reminders via Twilio, customer management, appointment scheduling, and analytics.

## Features

- **Business Management**: Create and manage multiple businesses
- **Customer Management**: Track customer information and preferences
- **Appointment Scheduling**: Schedule, confirm, and cancel appointments
- **SMS Reminders**: Automatic SMS reminders via Twilio with confirm/cancel support
- **Webhook Integration**: Incoming SMS webhooks for appointment confirmations
- **Dashboard Analytics**: Real-time analytics and metrics

## Tech Stack

### Backend
- Node.js + Express.js
- SQLite database
- Twilio for SMS messaging

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router for navigation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Twilio account (for SMS features)
- SQLite (included as dependency)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/appointment-reminder.git
cd appointment-reminder
```

2. **Install backend dependencies**
```bash
cd api
npm install
```

3. **Install frontend dependencies**
```bash
cd ../web
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `api` directory:

```env
PORT=3001
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

5. **Start the backend server**
```bash
cd api
npm run dev
```

6. **Start the frontend development server**
```bash
cd web
npm run dev
```

Visit `http://localhost:5173` to use the application.

## API Endpoints

### Businesses
- `GET /api/businesses` - List all businesses
- `GET /api/businesses/:id` - Get business by ID
- `POST /api/businesses` - Create new business
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

### Customers
- `GET /api/customers` - List all customers
- `GET /api/customers/business/:businessId` - Get customers by business
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Appointments
- `GET /api/appointments` - List all appointments
- `GET /api/appointments/business/:businessId` - Get appointments by business
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `POST /api/appointments/:id/confirm` - Confirm appointment

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/appointments-by-day` - Appointments by day
- `GET /api/analytics/by-business` - Analytics grouped by business

### Webhooks
- `POST /webhooks/twilio/incoming` - Twilio SMS incoming webhook
- `POST /webhooks/twilio/status-update` - Twilio status update webhook

## Twilio Configuration

1. Sign up for a [Twilio account](https://www.twilio.com/)
2. Get your Account SID and Auth Token from the console
3. Purchase a Twilio phone number
4. Configure webhook URL: `https://your-domain.com/webhooks/twilio/incoming`
5. Set SMS capability to "Yes" for the phone number

## Project Structure

```
appointment-reminder/
├── api/                    # Backend API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── businesses.js
│   │   │   ├── customers.js
│   │   │   ├── appointments.js
│   │   │   ├── analytics.js
│   │   │   └── webhooks.js
│   │   ├── db.js          # SQLite database setup
│   │   ├── sms.js         # Twilio SMS service
│   │   └── index.js       # Express app entry point
│   ├── package.json
│   └── database.db        # SQLite database (generated)
└── web/                    # Frontend application
    ├── src/
    │   ├── components/
    │   │   └── Layout.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Customers.jsx
    │   │   ├── Appointments.jsx
    │   │   └── Analytics.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

## License

ISC
