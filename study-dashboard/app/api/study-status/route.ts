import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {usersTable} from '@/lib/schema';
import {eq} from 'drizzle-orm';

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const phoneNumber = '+' + searchParams.get('phoneNumber')?.trim();

  if (!phoneNumber) {
    return NextResponse.json(
      {error: 'Phone number is required'},
      {status: 400}
    );
  }

  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, phoneNumber))
      .get();

    if (!user) {
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    return NextResponse.json({studyActive: user.studyActive === 1});
  } catch (error) {
    console.error('Error fetching study status:', error);
    return NextResponse.json(
      {error: 'Failed to fetch study status'},
      {status: 500}
    );
  }
}
