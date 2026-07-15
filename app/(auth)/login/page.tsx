'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // app/(auth)/login/page.tsx (updated function)
// ... (imports and state remain the same)
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (!email || !password) {
    toast.error('Email and password are required.');
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
    localStorage.setItem('userSession', 'true');
    localStorage.setItem('userName', data.user.name);
    localStorage.setItem('userEmail', data.user.email); // <-- Add this line
    toast.success('Login successful! Redirecting to dashboard...');
    router.push('/');
} else {
      toast.error(data.error || 'Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Login request failed:', error);
    toast.error('Network error. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
// ... (rest of the component remains the same)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="card w-full max-w-md p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600 mb-8">Sign in to your BaymaxCare account</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="input-field pl-10"
              required
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field pl-10"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Logging in...</span>
              </span>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}