import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '../../../../lib/userStore';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Create user in in-memory store
    const user = await createUser(name, email, password);

    return NextResponse.json({ message: 'User registered successfully', user: { id: user.id, email: user.email, name: user.name } }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'EMAIL_EXISTS') {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}