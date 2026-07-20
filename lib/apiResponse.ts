import { NextResponse } from 'next/server';

export class ApiResponse {
  /**
   * Returns a standard success wrapper payload.
   */
  static success<T>(data: T, status: number = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status }
    );
  }

  /**
   * Returns a standard error payload.
   */
  static error(
    message: string,
    code: string = 'INTERNAL_ERROR',
    status: number = 500,
    details?: any[]
  ) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code,
          message,
          ...(details && { details }),
        },
      },
      { status }
    );
  }

  /**
   * Returns a standard validation validation error details payload.
   */
  static validation(details: Array<{ field: string | number; issue: string }>) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'The request body failed validation checks.',
          details,
        },
      },
      { status: 400 }
    );
  }
}
