import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../services/AuthService';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Authenticate using MongoDB through our AuthService helper
    const user = await AuthService.authenticateUser({ email, password });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Return success with user data structured exactly as the frontend LoginPage expects
    return NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.email.split('@')[0], // Extract username from email
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
  }
}