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
console.log('Connected to SQLite DB.');
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
// Handle incoming SMS
app.post('/sms', async (req, res) => {
    const { Body, From } = req.body;
    console.log('Received SMS from:', From);
    // Retrieve or create user record
    let userRecord = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, From))
        .get();
    if (!userRecord) {
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
        let messages = [];
        try {
            messages = JSON.parse(userRecord.messages || '[]');
        }
        catch {
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
    // Get AI response based on the latest message and history.
    const responseMessage = await InitialResponse(Body, conversationHistory);
    // If the response doesn't prompt for clarification, assume topic is specific and mark studyActive as true.
    if (responseMessage.content &&
        !responseMessage.content.toLowerCase().includes('STUDY_READY')) {
        await db
            .update(usersTable)
            .set({ studyActive: 1 })
            .where(eq(usersTable.id, From));
    }
    const twiml = new MessagingResponse();
    twiml.message(responseMessage.content || 'No response from AI');
    // Append AI response to the user's responses
    let responsesArr = [];
    if (userRecord) {
        try {
            responsesArr = JSON.parse(userRecord.responses || '[]');
        }
        catch {
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
    res.type('text/xml').send(twiml.toString());
});
// Cron job: runs every 30 minutes
cron.schedule('*/2 * * * *', async () => {
    console.log('Cron job running: sending study prompts.');
    await sendStudyPrompts();
});
