import mongoose from 'mongoose';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey:
    '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',
});

export async function InitialResponse(message: string) {
  // message = "i have a linear algebra exam next week."
  const initialCompletion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant. Assisting students with studying for their upcoming exams and tests. Keep out for the topic and timeline of the exam. Is it specific enough? If not, try and pin point the topic, give options so the user can choose from them. Keep it simple, clear and concise. No ending sentences. Mostly just the list of options. If neccessary.',
      },
      {
        role: 'user',
        content: message, // "i have a linear algebra exam next week."
      },
    ],
    store: true,
  });

  return initialCompletion.choices[0].message;
}
