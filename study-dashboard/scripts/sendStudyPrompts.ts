import cron from "node-cron"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import { usersTable } from "../lib/schema"
import { eq } from "drizzle-orm"
import { Twilio } from "twilio"
import { OpenAI } from "openai"
import dotenv from "dotenv"

dotenv.config()

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const db = drizzle(client)

const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function generateStudyPrompt(user: any): Promise<string> {
  if (!user || !user.responses || user.responses.length === 0) {
    return "No study prompt available at the moment."
  }

  const delimiter = "|||"
  const responsesArray = user.responses.split(delimiter)

  console.log("Deserialized user responses:", responsesArray)

  const userResponse = responsesArray[responsesArray.length - 1]
  console.log("Last AI response (userResponse):", userResponse)

  const systemPrompt = `
    You are an AI study assistant designed to help students prepare for exams using active recall and spaced repetition. Your goal is to generate clear, concise, and relevant questions based on the topic the student is studying.

    The student is studying the following topic: ${userResponse}. Only the student's most recent response is provided. Use this information to generate a study question. Keep the question focused on the topic.

    Generate a question that tests the student's understanding of the topic. The question should:
    1. Be specific to the topic.
    2. Encourage critical thinking or recall of key concepts.
    3. Vary in format (e.g., multiple-choice, short-answer, or conceptual).
    4. Be suitable for a quick study session (1-2 minutes to answer).

    End your response with READY_STUDY to indicate that the question is ready for the student.
  `

  console.log("systemPrompt:", systemPrompt)

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "system", content: systemPrompt }],
  })

  const message = completion.choices[0].message
  if (!message || !message.content || message.content.trim() === "") {
    return "Please review your study material."
  }

  return message.content
}

async function sendStudyPrompts() {
  const usersInStudy = await db.select().from(usersTable).where(eq(usersTable.studyActive, 1)).all()

  for (const user of usersInStudy) {
    try {
      const studyPrompt = await generateStudyPrompt(user)

      await twilioClient.messages.create({
        body: studyPrompt,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.id, // assuming the user id is their phone number
      })

      console.log(`Sent study prompt to ${user.id}`)

      // Update the user's responses in the database
      const updatedResponses = user.responses ? `${user.responses}|||${studyPrompt}` : studyPrompt

      await db.update(usersTable).set({ responses: updatedResponses }).where(eq(usersTable.id, user.id)).run()
    } catch (err) {
      console.error(`Error sending study prompt to ${user.id}:`, err)
    }
  }
}

// Run the cron job every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log(`[${new Date().toISOString()}] Cron job triggered: sending study prompts.`)
  await sendStudyPrompts()
})

console.log("Cron job scheduler started")

