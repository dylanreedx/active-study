import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { usersTable } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  const { phoneNumber, code } = await req.json()

  try {
    const user = await db.select().from(usersTable).where(eq(usersTable.id, phoneNumber)).get()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Clear the verification code and set verified to true after successful verification
    await db.update(usersTable).set({ verificationCode: null, verified: 1 }).where(eq(usersTable.id, phoneNumber)).run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying code:", error)
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 })
  }
}

