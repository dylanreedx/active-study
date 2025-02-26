import cron from 'node-cron';
import express from 'express';
import bodyParser from 'body-parser';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse.js';
import { InitialResponse } from './utils/response.js';
import { usersTable } from './db/schema.js';
import 'dotenv/config';
import { db } from './db/index.js';
import { eq } from 'drizzle-orm';
import { buildConversationHistory } from './utils/build-convo-history.js';
import { sendStudyPrompts } from './utils/cron.js';
const app = express();
const port = '3000';
app.use(bodyParser.urlencoded({ extended: true }));
console.log(`[${new Date().toISOString()}] Connected to SQLite DB.`);
app.listen(port, () => {
    console.log(`[${new Date().toISOString()}] Example app listening on port ${port}`);
});
// Handle incoming SMS
app.post('/sms', async (req, res) => {
    const { Body, From } = req.body;
    console.log(`[${new Date().toISOString()}] Received SMS from: ${From} with body: "${Body}"`);
    // Retrieve or create user record
    let userRecord = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, From))
        .get();
    if (!userRecord) {
        console.log(`[${new Date().toISOString()}] No user record found for ${From}. Creating new record.`);
        await db.insert(usersTable).values({
            id: From,
            messages: JSON.stringify([Body]),
            responses: JSON.stringify([]),
            studyActive: 0, // 0 indicates refinement phase
        });
        userRecord = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, From))
            .get();
    }
    else {
        console.log(`[${new Date().toISOString()}] Found user record for ${From}. Updating messages.`);
        let messages = [];
        try {
            messages = JSON.parse(userRecord.messages || '[]');
        }
        catch (err) {
            console.error(`[${new Date().toISOString()}] Error parsing messages for ${From}:`, err);
            messages = [];
        }
        messages.push(Body);
        await db
            .update(usersTable)
            .set({ messages: JSON.stringify(messages) })
            .where(eq(usersTable.id, From));
    }
    // Build conversation context using the new helper
    const conversationHistory = buildConversationHistory(userRecord);
    console.log(`[${new Date().toISOString()}] Conversation history for ${From}:\n${conversationHistory}`);
    // Get AI response based on the latest message and history.
    const responseMessage = await InitialResponse(Body, conversationHistory);
    console.log(`[${new Date().toISOString()}] AI response for ${From}: "${responseMessage.content}"`);
    // If the response doesn't prompt for clarification (i.e. no 'STUDY_READY'), mark studyActive as true.
    if (responseMessage.content &&
        !responseMessage.content.toLowerCase().includes('study_ready')) {
        await db
            .update(usersTable)
            .set({ studyActive: 1 })
            .where(eq(usersTable.id, From));
        console.log(`[${new Date().toISOString()}] User ${From} marked as studyActive.`);
    }
    else {
        console.log(`[${new Date().toISOString()}] User ${From} still in refinement phase.`);
    }
    const twiml = new MessagingResponse();
    twiml.message(responseMessage.content || 'No response from AI');
    // Append AI response to the user's responses
    let responsesArr = [];
    if (userRecord) {
        try {
            responsesArr = JSON.parse(userRecord.responses || '[]');
        }
        catch (err) {
            console.error(`[${new Date().toISOString()}] Error parsing responses for ${From}:`, err);
            responsesArr = [];
        }
    }
    if (responseMessage.content) {
        responsesArr.push(responseMessage.content);
    }
    await db
        .update(usersTable)
        .set({ responses: JSON.stringify(responsesArr) })
        .where(eq(usersTable.id, From));
    console.log(`[${new Date().toISOString()}] Sending SMS response to ${From}.`);
    res.type('text/xml').send(twiml.toString());
});
// Cron job: runs every 30 minutes (for testing, you might change this to every 2 minutes or every minute)
cron.schedule('*/5 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Cron job triggered: sending study prompts.`);
    await sendStudyPrompts();
});
