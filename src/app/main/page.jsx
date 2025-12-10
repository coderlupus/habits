'use client';

import { useState, useEffect, Suspense, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '@/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import RecommendedHabits from '@/components/recommended-habits';
import { addHabitAction } from '../actions';
import HabitListServer from './habit-list-server';
import HabitListSkeleton from './habit-list-skeleton';

export default function MainPage() {
  const [user, setUser] = useState(null);
  const [newHabit, setNewHabit] = useState('');
  const [newHabitGoal, setNewHabitGoal] = useState('1');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [dates, setDates] = useState([]);
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/');
      }
    });

    const getWeekDates = () => {
      const today = new Date();
      const weekDates = [];
      const dayOfWeek = today.getDay();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - dayOfWeek + i);

        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        const dayNumber = date.getDate();
        const isToday = today.toDateString() === date.toDateString();

        weekDates.push({
          day: dayName,
          date: dayNumber.toString(),
          active: isToday,
        });
      }
      return weekDates;
    };

    setDates(getWeekDates());

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast.success('Successfully logged out!');
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out.');
    }
  };

  const handleAddHabit = async (habitName) => {
    const name = habitName || newHabit;
    if (name.trim() === '' || !user) return;

    setIsAdding(true);
    startTransition(async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('goal', newHabitGoal);

        const result = await addHabitAction(user.uid, formData);

        if (result.success) {
            toast.success(result.message);
            setNewHabit('');
            setNewHabitGoal('1');
            setIsAddDialogOpen(false);
        } else {
            toast.error(result.error);
        }
        setIsAdding(false);
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <div className="bg-gray-50 min-h-screen font-sans relative pb-28">
        <div className="container mx-auto px-4 pt-6">
          <header className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hi, {user.displayName || user.email.split('@')[0]} &#128075;</h1>
                <p className="text-sm text-gray-500">Let's make habits together!</p>
              </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center text-2xl p-1">&#128579;</div>
              <button onClick={handleLogout} className="p-2 text-gray-500 rounded-full active:bg-gray-200">
                  <User className="w-6 h-6" />
              </button>
            </div>
          </header>

          <div className="flex justify-between items-center mb-6 space-x-2 overflow-x-auto pb-2">
              {dates.map((d, index) => (
                  <div key={index} className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-20 rounded-2xl ${d.active ? 'bg-white shadow-md' : ''}`}>
                      <span className={`text-sm font-medium ${d.active ? 'text-blue-600' : 'text-gray-500'}`}>{d.day}</span>
                      <span className={`text-2xl font-bold ${d.active ? 'text-blue-600' : 'text-gray-800'}`}>{d.date}</span>
                  </div>
              ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-gray-900">Habits</h3>
              <a href="#" className="text-blue-600 text-sm font-semibold">VIEW ALL</a>
            </div>

            <Suspense fallback={<HabitListSkeleton />}>
              <HabitListServer userId={user.uid} />
            </Suspense>

            <RecommendedHabits onAddHabit={handleAddHabit} />
          </div>
        </div>

        {/* Add Habit Dialog */}
        <footer className="fixed bottom-0 left-0 right-0 bg-transparent flex justify-center items-center p-4" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg shadow-blue-500/50 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Plus className="w-9 h-9" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new habit</DialogTitle>
              <DialogDescription>What's a new habit you want to build?</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div>
                    <Label htmlFor="habit-name">Name</Label>
                    <Input id="habit-name" placeholder="e.g., Drink 2L of water" value={newHabit} onChange={(e) => setNewHabit(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="habit-goal">Goal (times per day)</Label>
                    <Input id="habit-goal" type="number" min="1" value={newHabitGoal} onChange={(e) => setNewHabitGoal(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()} />
                </div>
            </div>
            <DialogFooter>
              <Button onClick={() => handleAddHabit()} disabled={isAdding || isPending}>
                {(isAdding || isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />}
                {(isAdding || isPending) ? 'Adding...' : 'Add Habit'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </footer>
      </div>
    </Dialog>
  );
}