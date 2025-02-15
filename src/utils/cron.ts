import twilio from 'twilio';
import {usersTable} from '../db/schema.js';
import {db} from '../db/index.js';
import {eq} from 'drizzle-orm';
import {generateStudyPrompt} from './generate-study-prompt.js';

// Set up Twilio client as before
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendStudyPrompts() {
  // Query all users who are in active study mode
  const usersInStudy = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.studyActive, 1))
    .all();

  for (const user of usersInStudy) {
    if (user.studyActive !== 1) return;
    try {
      // Generate study prompt (this can be a call to your LLM with context)
      const studyPrompt = await generateStudyPrompt(user); // Your own function for study prompts

      // Send the study prompt via SMS using Twilio
      await twilioClient.messages.create({
        body: studyPrompt,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.id, // assuming the user id is their phone number
      });

      console.log(`Sent study prompt to ${user.id}`);
    } catch (err) {
      console.error(`Error sending study prompt to ${user.id}:`, err);
    }
  }
}
