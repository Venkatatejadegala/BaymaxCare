import { NextRequest } from 'next/server';
import { AuthService } from '../../../../services/AuthService';
import { ApiResponse } from '../../../../lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    // 1. Extract request payload parameters
    const body = await request.json();

    // 2. Delegate registration processing to AuthService
    const result = await AuthService.registerUser(body);

    // 3. Map validation and business rule failures to standard HTTP responses
    if (!result.success) {
      if (result.code === 'VALIDATION_FAILED') {
        return ApiResponse.validation(result.details || []);
      }
      if (result.code === 'DUPLICATE_EMAIL') {
        return ApiResponse.error(result.message, result.code, 409);
      }
      return ApiResponse.error(result.message, result.code || 'BAD_REQUEST', 400);
    }

    // 4. Return standard success payload indicating user creation (201 Created)
    return ApiResponse.success(result.data, 201);
  } catch (error: any) {
    console.error('Registration controller error:', error);
    return ApiResponse.error(
      'An unexpected error occurred during registration.',
      'INTERNAL_ERROR',
      500
    );
  }
}