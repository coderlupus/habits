'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/firebase';
import { getHabit } from '@/lib/firestore'; // We will use getHabit
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HabitCalendar from './HabitCalendar';

export default function HabitDetailPage() {
    const [habit, setHabit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                if (id) {
                    try {
                        const habitData = await getHabit(id);
                        if (habitData) {
                            setHabit(habitData);
                        } else {
                            setError('Habit not found.');
                        }
                    } catch (err) {
                        console.error("Error fetching habit:", err);
                        setError('Failed to load habit.');
                    }
                }
                setLoading(false);
            } else {
                router.push('/');
            }
        });

        return () => unsubscribe();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <p className="text-lg text-gray-700">Loading habit...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <p className="text-lg text-red-600">{error}</p>
                <Link href="/main" className="mt-4 text-blue-600 hover:underline">
                    Go back to main page
                </Link>
            </div>
        );
    }

    if (!habit) {
         return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <p className="text-lg text-gray-700">Habit not found.</p>
                <Link href="/main" className="mt-4 text-blue-600 hover:underline">
                    Go back to main page
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <header className="flex items-center mb-8">
                <Link href="/main" className="flex items-center text-gray-800 hover:text-blue-600 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                    <span className="ml-2 font-semibold">Back to Habits</span>
                </Link>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">{habit.name}</h1>
                 <p className="text-gray-500">Your progress and details for this habit.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-2xl shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Progress Calendar</h2>
                        <HabitCalendar history={habit.history || []} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Details</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Daily Goal</p>
                            <p className="font-semibold text-lg">{habit.goal} times a day</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Created On</p>
                            <p className="font-semibold text-lg">{habit.createdAt ? new Date(habit.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
