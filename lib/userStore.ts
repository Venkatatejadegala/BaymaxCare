// In-memory user store for authentication without database
import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  createdAt: Date;
}

// In-memory storage - persists during server runtime
const users = new Map<string, User>();

// Generate a simple UUID-like ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function createUser(name: string, email: string, password: string): Promise<User> {
  // Check if user already exists
  const emailLower = email.toLowerCase();
  const userArray = Array.from(users.values());
  for (const user of userArray) {
    if (user.email.toLowerCase() === emailLower) {
      throw new Error('EMAIL_EXISTS');
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user: User = {
    id: generateId(),
    email: emailLower,
    password: hashedPassword,
    name,
    createdAt: new Date(),
  };

  users.set(user.id, user);
  return user;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const emailLower = email.toLowerCase();
  const userArray = Array.from(users.values());
  for (const user of userArray) {
    if (user.email.toLowerCase() === emailLower) {
      return user;
    }
  }
  return null;
}

export async function findUserById(id: string): Promise<User | null> {
  return users.get(id) || null;
}

export async function updateUser(id: string, updates: Partial<Omit<User, 'id' | 'email' | 'password' | 'createdAt'>>): Promise<User | null> {
  const user = users.get(id);
  if (!user) return null;

  const updated = { ...user, ...updates };
  users.set(id, updated);
  return updated;
}

export async function updateUserPassword(id: string, newPassword: string): Promise<boolean> {
  const user = users.get(id);
  if (!user) return false;

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  users.set(id, user);
  return true;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password);
}

