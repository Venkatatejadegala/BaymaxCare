import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      message: 'MongoDB Connected',
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    await connectDB();
    return NextResponse.json({
      success: true,
      message: 'MongoDB Connected',
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
