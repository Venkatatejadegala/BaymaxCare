import { connectDB } from '../lib/db';
import { User } from '../models/User';
import { RegisterSchema } from '../validators/auth';
import bcrypt from 'bcryptjs';

export class AuthService {
  /**
   * Registers a new user with validation checks, duplicate check, and password hashing.
   */
  static async registerUser(data: any) {
    // 1. Ensure DB Connection is ready
    await connectDB();

    // 2. Validate input fields using Zod
    const validation = RegisterSchema.safeParse(data);
    if (!validation.success) {
      const issues = validation.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        issue: issue.message,
      }));
      return {
        success: false,
        code: 'VALIDATION_FAILED',
        message: 'Input validation failed.',
        details: issues,
      };
    }

    const { name, email, password } = validation.data;
    const normalizedEmail = email.toLowerCase();

    // 3. Check for existing user records with the same email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return {
        success: false,
        code: 'DUPLICATE_EMAIL',
        message: 'This email is already registered.',
      };
    }

    // 4. Encrypt password hash using bcryptjs with 10 salt rounds
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Save the new user record (role defaults to 'patient')
    const newUser = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: 'patient',
    });

    return {
      success: true,
      data: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    };
  }

  /**
   * Verifies credentials for the NextAuth login callback.
   */
  static async authenticateUser(credentials: any) {
    if (!credentials?.email || !credentials?.password) {
      return null;
    }

    // 1. Ensure DB Connection is ready
    await connectDB();

    const email = credentials.email.toLowerCase();
    const password = credentials.password;

    // 2. Locate user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }

    // 3. Authenticate hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // 4. Return user object structure that NextAuth expects
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
