"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    useEffect(() => {
        // If not loading and no user is found, redirect to login
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    // Show loading state
    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    // If no user data, don't render the protected content
    if (!user) {
        return null; // We'll redirect in the useEffect
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
                        <h2 className="text-xl mb-4">Welcome, {user.full_name || user.username}!</h2>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">User Information</h3>
                            <div className="mt-5 border-t border-gray-200">
                                <dl className="divide-y divide-gray-200">
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.full_name}</dd>
                                    </div>
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Username</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.username}</dd>
                                    </div>
                                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}