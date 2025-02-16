import OpenAI from 'openai';
import 'dotenv/config';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export async function generateStudyPrompt(user) {
    if (!user || !user.responses || user.responses.length === 0) {
        return 'No study prompt available at the moment.';
    }
    // Deserialize the responses string back into an array
    const delimiter = '|||';
    const responsesArray = user.responses.split(delimiter);
    console.log('Deserialized user responses:', responsesArray);
    // Get the last response
    const userResponse = responsesArray[responsesArray.length - 1];
    console.log('Last AI response (userResponse):', userResponse);
    // Define the system prompt
    const systemPrompt = `
      You are an AI study assistant designed to help students prepare for exams using active recall and spaced repetition. Your goal is to generate clear, concise, and relevant questions based on the topic the student is studying.
  
      The student is studying the following topic: ${userResponse}. Only the student's most recent response is provided. Use this information to generate a study question. Keep the question focused on the topic.
  
      Generate a question that tests the student's understanding of the topic. The question should:
      1. Be specific to the topic.
      2. Encourage critical thinking or recall of key concepts.
      3. Vary in format (e.g., multiple-choice, short-answer, or conceptual).
      4. Be suitable for a quick study session (1-2 minutes to answer).
  
      End your response with READY_STUDY to indicate that the question is ready for the student.
    `;
    console.log('systemPrompt:', systemPrompt);
    // Call the OpenAI API to generate a question
    const completion = await openai.chat.completions.create({
        model: 'gpt-4', // Use the correct model name
        messages: [{ role: 'system', content: systemPrompt }],
    });
    // Extract the generated question
    const message = completion.choices[0].message;
    if (!message || !message.content || message.content.trim() === '') {
        // Fallback message if LLM returns an empty response
        return 'Please review your study material.';
    }
    return message.content;
}
