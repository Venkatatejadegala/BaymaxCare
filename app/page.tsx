// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import EnhancedDashboard from '../components/EnhancedDashboard';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This is a placeholder for a real authentication check.
    const userIsAuthenticated = localStorage.getItem('userSession') === 'true';

    if (userIsAuthenticated) {
      setIsLoggedIn(true);
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Only render the dashboard if the user is authenticated
  return isLoggedIn ? (
    <MainLayout>
      <EnhancedDashboard />
    </MainLayout>
  ) : null;
}