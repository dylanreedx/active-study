import OpenAI from 'openai';
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'system',
      content:
        'You are a helpful assistant. Assisting students with studying for their upcoming exams and tests.',
    },
    {
      role: 'user',
      content: 'Write a haiku about recursion in programming.',
    },
  ],
  store: true,
});

console.log(completion.choices[0].message);
