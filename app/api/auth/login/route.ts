import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword } from '../../../../lib/userStore';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await verifyPassword(user, password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Return success with user data
    return NextResponse.json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name } }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
  }
}