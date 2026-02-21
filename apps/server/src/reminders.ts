import cron from 'node-cron';
import { getUpcomingReminders, markReminderSent } from './db';
import { sendSMS } from './twilio-client';

export function startReminderScheduler() {
  cron.schedule('0 8 * * *', async () => {
    console.log('Running daily birthday reminder check...');
    await checkAndSendReminders();
  }, {
    scheduled: true,
    timezone: "America/Los_Angeles"
  });

  console.log('Reminder scheduler started - will run daily at 8:00 AM PT');
}

export async function checkAndSendReminders(): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const reminders = await getUpcomingReminders(today);
    
    console.log(`Found ${reminders.length} reminders to send`);
    
    for (const reminder of reminders) {
      try {
        const message = formatReminderMessage(reminder.contactName, reminder.occasionDate, reminder.occasionType, reminder.occasionLabel);
        await sendSMS(reminder.userPhone, message);
        await markReminderSent(reminder.id);
        console.log(`Reminder sent to ${reminder.userPhone} for ${reminder.contactName}`);
      } catch (error) {
        console.error(`Failed to send reminder for ${reminder.contactName}:`, error);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (reminders.length > 0) {
      console.log(`Successfully sent ${reminders.length} reminders`);
    }
  } catch (error) {
    console.error('Error in reminder scheduler:', error);
  }
}

function formatReminderMessage(name: string, dateMMDD: string, type: string, label: string | null): string {
  const [month, day] = dateMMDD.split('-').map(Number);
  const today = new Date();
  const currentYear = today.getFullYear();
  let nextDate = new Date(currentYear, month - 1, day);
  if (nextDate < today) nextDate = new Date(currentYear + 1, month - 1, day);
  
  const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const formatted = nextDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const eventName = label || `${name}'s ${type}`;
  
  if (daysUntil === 0) {
    return `🎉 It's ${eventName} today! Don't forget to reach out!`;
  } else if (daysUntil === 1) {
    return `🎂 Reminder: ${eventName} is tomorrow (${formatted})!`;
  } else {
    return `🎈 Heads up: ${eventName} is in ${daysUntil} days (${formatted}). Time to plan!`;
  }
}

export async function testReminderCheck(): Promise<void> {
  console.log('Running test reminder check...');
  await checkAndSendReminders();
}
