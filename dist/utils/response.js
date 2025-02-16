import OpenAI from 'openai';
import 'dotenv/config';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export async function InitialResponse(message, conversationHistory) {
    // System prompt instructs the assistant to evaluate the exam topic for specificity.
    const systemPrompt = `
You are a study assistant helping students prepare for their exams.
When a user sends a command like "START studying for my [EXAM_TOPIC] exam", you must evaluate whether the exam topic is specific enough.
- If the topic is too broad, ask clarifying questions by listing three focused options in a clear, concise list. For example, if the topic is "history", you might list: "Option 1: World War II", "Option 2: Renaissance Art", "Option 3: Modern Politics".
- If the topic is specific enough, provide a brief study prompt and append the keyword STUDY_READY at the end of your message.
Always use any previous conversation context to inform your response.
Keep your response simple and direct.
  `;
    // Include previous conversation context along with the new message.
    const userContent = `${conversationHistory}\nUser: ${message}`;
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
        ],
        store: true,
    });
    return completion.choices[0].message;
}
