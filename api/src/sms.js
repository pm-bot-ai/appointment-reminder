const twilio = require('twilio');

let client = null;

function initTwilio(config) {
  const { accountSid, authToken } = config;
  if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
    return true;
  }
  return false;
}

function sendSMS(to, body) {
  if (!client) {
    throw new Error('Twilio not initialized. Call initTwilio() first.');
  }

  return client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body
  });
}

async function sendReminder(to, businessName, appointmentDate, appointmentTime) {
  if (!client) {
    throw new Error('Twilio not initialized');
  }

  const message = `Reminder: You have an appointment at ${businessName} on ${appointmentDate} at ${appointmentTime}. Reply YES to confirm or NO to cancel.`;

  return client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body: message
  });
}

async function confirmAppointment(smsSid) {
  if (!client) {
    throw new Error('Twilio not initialized');
  }

  const message = await client.messages(smsSid).fetch();
  
  if (message.body.toUpperCase().includes('YES')) {
    return { confirmed: true, sid: smsSid };
  } else if (message.body.toUpperCase().includes('NO')) {
    return { confirmed: false, sid: smsSid };
  }
  
  return { confirmed: null, sid: smsSid };
}

module.exports = {
  initTwilio,
  sendSMS,
  sendReminder,
  confirmAppointment
};
