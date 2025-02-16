import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema.js';
import { db } from '../db/index.js';
import { OpenAI } from 'openai';
import 'dotenv/config';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
// Example follow-up function
export async function followUpResponse(from, newUserMessage) {
    // Retrieve previous conversation from your DB
    const userRecord = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, from))
        .get();
    let userMessages = [];
    let assistantMessages = [];
    try {
        userMessages = JSON.parse(userRecord?.messages || '[]');
        assistantMessages = JSON.parse(userRecord?.responses || '[]');
    }
    catch {
        // default to empty arrays
    }
    // Build the conversation history
    const conversationHistory = [
        {
            role: 'system',
            content: 'You are a helpful assistant. Assisting students with studying for their upcoming exams. Ask clarifying questions to refine the topic if needed.',
        },
    ];
    // Append each past exchange
    userMessages.forEach((msg, i) => {
        conversationHistory.push({ role: 'user', content: msg });
        if (assistantMessages[i]) {
            conversationHistory.push({
                role: 'assistant',
                content: assistantMessages[i],
            });
        }
    });
    // Append the new user message
    conversationHistory.push({ role: 'user', content: newUserMessage });
    // Call the OpenAI API with the full context
    const response = await OpenAI.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: conversationHistory,
    });
    return response.choices[0].message;
}
