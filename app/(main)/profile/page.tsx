// app/(main)/profile/page.tsx
'use client'

import { useState, useEffect } from 'react';
import MainLayout from '../../../components/MainLayout';
import { UserIcon, EnvelopeIcon, CalendarIcon, HeartIcon } from '@heroicons/react/24/outline';

interface UserProfile {
    name: string;
    email: string;
    memberSince: string;
    healthScore: number;
}

export default function ProfilePage() {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch user data from localStorage on component mount
        const storedName = localStorage.getItem('userName');
        const storedEmail = localStorage.getItem('userEmail');

        if (storedName && storedEmail) {
            // Placeholder data, but now it uses the real name and email
            setUser({
                name: storedName,
                email: storedEmail,
                memberSince: 'September 2025', // You can make this dynamic later
                healthScore: 85, // You can make this dynamic later
            });
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex h-screen items-center justify-center text-gray-500">
                    <p>Loading user data...</p>
                </div>
            </MainLayout>
        );
    }

    if (!user) {
        return (
            <MainLayout>
                <div className="flex h-screen items-center justify-center text-gray-500">
                    <p>User not found. Please log in.</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto space-y-6 p-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 flex-shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="text-blue-100 text-lg">Health is a journey, not a destination.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <UserIcon className="w-5 h-5 text-gray-500" />
                                <p className="text-gray-700 font-medium">Name: <span className="text-gray-900">{user.name}</span></p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                                <p className="text-gray-700 font-medium">Email: <span className="text-gray-900">{user.email}</span></p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <CalendarIcon className="w-5 h-5 text-gray-500" />
                                <p className="text-gray-700 font-medium">Member Since: <span className="text-gray-900">{user.memberSince}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-lg font-semibold mb-4">Health Overview</h2>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <HeartIcon className="w-5 h-5 text-red-500" />
                                <p className="text-gray-700 font-medium">Health Score: <span className="text-gray-900">{user.healthScore}%</span></p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${user.healthScore}%` }}></div>
                            </div>
                            <p className="text-sm text-gray-600">
                                Your health score is a general wellness metric based on your activity, diet, and check-ups.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}