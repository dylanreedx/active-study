import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { usersTable } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  const { studyActive, phoneNumber } = await req.json()

  try {
    await db
      .update(usersTable)
      .set({ studyActive: studyActive ? 1 : 0 })
      .where(eq(usersTable.id, phoneNumber))
      .run()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error toggling study mode:", error)
    return NextResponse.json({ error: "Failed to toggle study mode" }, { status: 500 })
  }
}

