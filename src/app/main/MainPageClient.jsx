'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target } from 'lucide-react';

export default function MainPageClient({ recommendedHabits }) {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        setAuth(getAuth(app));
    }, []);

    useEffect(() => {
        if (!auth) return;
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                router.push("/");
            }
        });
        return () => unsubscribe();
    }, [auth, router]);

    const handleLogout = async () => {
        if (!auth) return;
        await signOut(auth);
        router.push("/");
    };

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            <header className="flex items-center justify-between p-4 border-b border-slate-700">
                <h1 className="text-2xl font-bold tracking-wider">haBITS</h1>
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </header>

            <main className="p-8">
                <div className="flex justify-between items-center mb-8">
                    <Input
                        type="search"
                        placeholder="Search habits..."
                        className="w-1/3 bg-slate-800 border-slate-700 placeholder:text-slate-400"
                    />
                     <Button className="bg-slate-700 hover:bg-slate-600">
                        <Plus className="mr-2 h-4 w-4" /> Add Habit
                    </Button>
                </div>

                <div className="space-y-8">
                    <div className="p-6 rounded-lg border border-slate-700">
                       <h2 className="text-lg font-semibold mb-4">Your Habits</h2>
                       <p className="text-slate-400">You haven't added any habits yet.</p>
                    </div>

                    <div className="p-6 rounded-lg border border-slate-700">
                        <h2 className="text-lg font-semibold mb-4">Recommended Habits</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {recommendedHabits.map((habit, index) => (
                                <div key={index} className="p-6 rounded-lg bg-slate-800 flex items-center justify-center">
                                     <Target className="w-5 h-5 mr-3" />
                                    <span>{habit.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
