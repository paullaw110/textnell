import dotenv from 'dotenv';

dotenv.config();

// @ts-ignore
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error('Missing Twilio credentials in environment variables');
}

export const twilioClient = twilio(accountSid, authToken);

export async function sendSMS(to: string, body: string): Promise<void> {
  try {
    const message = await twilioClient.messages.create({
      body,
      ...(messagingServiceSid 
        ? { messagingServiceSid } 
        : { from: fromNumber }),
      to
    });
    
    console.log(`SMS sent to ${to}: ${message.sid}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error);
    throw error;
  }
}

export function createTwiMLResponse(message: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>${message}</Message>
</Response>`;
}
