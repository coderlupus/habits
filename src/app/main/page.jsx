'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase'; // Import app
import { addHabit, getHabits, deleteHabit } from '@/lib/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function MainPage() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [auth, setAuth] = useState(null); // State for auth

  useEffect(() => {
    // Initialize auth on the client
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userHabits = await getHabits(currentUser.uid);
        setHabits(userHabits);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddHabit = async () => {
    if (newHabit.trim() === '' || !user) return;
    try {
      await addHabit(user.uid, { name: newHabit });
      setNewHabit('');
      const userHabits = await getHabits(user.uid);
      setHabits(userHabits);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    // The new deleteHabit function only needs the habitId
    try {
      await deleteHabit(habitId);
      const userHabits = await getHabits(user.uid);
      setHabits(userHabits);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  if (!user) {
    return <p>Loading...</p>; // Or a loading spinner
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-2xl">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Habits</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </header>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mb-4">Add New Habit</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a new habit</DialogTitle>
              <DialogDescription>
                What's a new habit you want to build?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="e.g., Read 10 pages a day"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddHabit}>Add Habit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          {habits.map((habit) => (
            <Card key={habit.id}>
              <CardContent className="flex justify-between items-center p-4">
                <p>{habit.name}</p>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteHabit(habit.id)}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
