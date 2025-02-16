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
    console.log('num:', phoneNumber);
    console.log('user:', user);

    if (!user) {
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    console.log('user responses:', user);
    const delimiter = '|||';
    const materials = user.responses
      ? user.responses.split(delimiter).map((material, index) => ({
          id: index.toString(),
          content: material.trim(),
          timestamp: new Date(Date.now() - index * 300000).toISOString(), // Dummy timestamps, 5 minutes apart
        }))
      : [];

    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching study materials:', error);
    return NextResponse.json(
      {error: 'Failed to fetch study materials'},
      {status: 500}
    );
  }
}
