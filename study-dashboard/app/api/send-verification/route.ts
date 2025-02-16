import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { usersTable } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { Twilio } from "twilio"

const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!)

export async function POST(req: Request) {
  const { phoneNumber } = await req.json()

  try {
    // Generate a random 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // Check if the user exists
    const user = await db.select().from(usersTable).where(eq(usersTable.id, phoneNumber)).get()

    if (user) {
      // Update existing user with new verification code
      await db.update(usersTable).set({ verificationCode }).where(eq(usersTable.id, phoneNumber)).run()
    } else {
      // Create new user
      await db.insert(usersTable).values({ id: phoneNumber, verificationCode }).run()
    }

    // Send verification code via SMS
    await twilioClient.messages.create({
      body: `Your Study Dashboard verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error sending verification code:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}

