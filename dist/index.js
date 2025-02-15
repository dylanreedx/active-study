import express from 'express';
import bodyParser from 'body-parser';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse.js';
import { InitialResponse } from './utils/response.js';
import { usersTable } from './db/schema.js';
import 'dotenv/config';
import { db } from './db/index.js';
import { eq } from 'drizzle-orm';
const app = express();
const port = '3000';
app.use(bodyParser.urlencoded({ extended: true }));
console.log('Connected to SQLite DB.');
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
app.post('/twilio/sms-status', (req, res) => {
    const { MessageSid, SmsStatus, To, From, ErrorCode, ErrorMessage } = req.body;
    console.log('Received SMS Event:');
    console.log(`Message SID: ${MessageSid}`);
    console.log(`Status: ${SmsStatus}`);
    console.log(`To: ${To}, From: ${From}`);
    if (ErrorCode) {
        console.log(`Error Code: ${ErrorCode}, Message: ${ErrorMessage}`);
    }
    res.status(200).send('SMS event received');
});
app.post('/sms', async (req, res) => {
    const { Body, From } = req.body;
    console.log('Received SMS from:', From);
    // Check if the user exists
    const existingUsers = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, From))
        .all();
    if (existingUsers.length === 0) {
        await db.insert(usersTable).values({
            id: From,
            messages: JSON.stringify([Body]),
            responses: JSON.stringify([]),
            onboarding: 0,
        });
    }
    else {
        const user = existingUsers[0];
        let messages = [];
        try {
            messages = JSON.parse(user.messages || '[]');
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
    const response = await InitialResponse(Body);
    const twiml = new MessagingResponse();
    twiml.message(response.content || 'No response from AI');
    // Update the responses array
    const userRecord = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, From))
        .get();
    let responsesArr = [];
    try {
        responsesArr = JSON.parse(userRecord?.responses || '[]');
    }
    catch {
        responsesArr = [];
    }
    if (response.content) {
        responsesArr.push(response.content);
    }
    await db
        .update(usersTable)
        .set({ responses: JSON.stringify(responsesArr) })
        .where(eq(usersTable.id, From));
    res.type('text/xml').send(twiml.toString());
});
