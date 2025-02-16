import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { usersTable } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { topic, phoneNumber } = await req.json()

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that analyzes study topics and determines if they are specific enough to start a study session.",
        },
        {
          role: "user",
          content: `Analyze this study topic and respond with 'ready' if it's specific enough to start studying, or 'not ready' if it needs more specificity: ${topic}`,
        },
      ],
    })

    const studyReady = completion.choices[0].message.content?.toLowerCase().includes("ready") ? 1 : 0

    await db.update(usersTable).set({ studyActive: studyReady }).where(eq(usersTable.id, phoneNumber)).run()

    return NextResponse.json({ success: true, studyReady: studyReady === 1 })
  } catch (error) {
    console.error("Error setting study topic:", error)
    return NextResponse.json({ error: "Failed to set study topic" }, { status: 500 })
  }
}

