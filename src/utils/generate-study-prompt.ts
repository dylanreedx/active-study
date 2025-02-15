import OpenAI from 'openai';
import 'dotenv/config';
import {SelectUser} from '../db/schema.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStudyPrompt(user: SelectUser): Promise<string> {
  if (!user || !user.responses || user.responses.length === 0) {
    return 'No study prompt available at the moment.';
  }

  console.log('user', user.responses.split(','));

  const userResponse = user.responses.split(',').pop();

  const systemPrompt = `
You are a study assistant helping students prepare for their exams.
Here is what the user is trying to study for: ${userResponse}.
Ask a challenging question about the topic to help the student think critically.
keyword READY_STUDY.
  `;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{role: 'system', content: systemPrompt}],
    store: true,
  });

  const message = completion.choices[0].message;
  if (!message || !message.content || message.content.trim() === '') {
    // Fallback message if LLM returns an empty response
    return 'Please review your study material.';
  }
  return message.content;
}
