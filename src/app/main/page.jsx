'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getHabits, addHabit, deleteHabit, updateHabit } from '@/lib/firestore'; // Import Firestore functions
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Calendar, Home, Plus, Settings, User, Droplet, Footprints, Leaf, Trash2 } from 'lucide-react';

// A map to assign icons to habits based on name keywords
const habitIcons = {
  water: <Droplet className="w-6 h-6 text-blue-500" />,
  walk: <Footprints className="w-6 h-6 text-orange-500" />,
  run: <Footprints className="w-6 h-6 text-orange-500" />,
  plant: <Leaf className="w-6 h-6 text-green-500" />,
  read: <Droplet className="w-6 h-6 text-purple-500" />, // Placeholder icon
  default: <Droplet className="w-6 h-6 text-gray-500" />
};

const getHabitIcon = (name) => {
    const lowerCaseName = name.toLowerCase();
    for (const key in habitIcons) {
        if (lowerCaseName.includes(key)) {
            return habitIcons[key];
        }
    }
    return habitIcons.default;
};

const dates = [
  { day: 'SAT', date: '3', active: true },
  { day: 'SUN', date: '4' },
  { day: 'MON', date: '5' },
  { day: 'TUE', date: '6' },
  { day: 'WED', date: '7' },
  { day: 'THU', date: '8' },
  { day: 'FRI', date: '9' },
];

export default function MainPage() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch habits from Firestore
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

  const fetchHabits = async () => {
      if (!user) return;
      const userHabits = await getHabits(user.uid);
      setHabits(userHabits);
  }

  const handleAddHabit = async () => {
    if (newHabit.trim() === '' || !user) return;
    try {
      await addHabit(user.uid, { name: newHabit }); 
      setNewHabit('');
      await fetchHabits();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteHabit(habitId);
      await fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleProgressUpdate = async (habit) => {
      const newProgress = (habit.progress || 0) + 1;
      try {
          await updateHabit(habit.id, newProgress);
          await fetchHabits();
      } catch (error) {
          console.error('Error updating progress:', error);
      }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans relative pb-28">
      <div className="container mx-auto px-4 pt-6">
        {/* Header... */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-700" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Hi, {user.displayName || user.email.split('@')[0]} &#128075;</h1>
                <p className="text-sm text-gray-500">Let's make habits together!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center text-2xl p-1">&#128579;</div>
          </div>
        </header>

        {/* Toggles and Date Selector... */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6 border border-gray-200">
          <button className="flex-1 bg-white shadow-sm text-gray-800 rounded-full py-2 text-sm font-semibold">Today</button>
          <button className="flex-1 text-gray-500 rounded-full py-2 text-sm font-semibold flex items-center justify-center space-x-2">
            <span>Clubs</span>
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">2</span>
          </button>
        </div>
        <div className="flex justify-between items-center mb-6 space-x-2 overflow-x-auto pb-2">
            {dates.map((d, index) => (
                <div key={index} className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-20 rounded-2xl ${d.active ? 'bg-white shadow-md' : ''}`}>
                    <span className={`text-sm font-medium ${d.active ? 'text-blue-600' : 'text-gray-500'}`}>{d.day}</span>
                    <span className={`text-2xl font-bold ${d.active ? 'text-blue-600' : 'text-gray-800'}`}>{d.date}</span>
                </div>
            ))}
        </div>

        {/* Daily Goals and Challenges... */}
        <Card className="bg-blue-600 text-white p-5 rounded-2xl mb-6 shadow-lg shadow-blue-500/20">
          {/* ... content ... */}
        </Card>
        <div className="mb-6">
          {/* ... content ... */}
        </div>

        {/* Habits */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-gray-900">Habits</h3>
            <a href="#" className="text-blue-600 text-sm font-semibold">VIEW ALL</a>
          </div>
          <div className="space-y-3">
            {habits.map((habit) => (
              <Card key={habit.id} className="p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    {getHabitIcon(habit.name)}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{habit.name}</p>
                    <p className="text-sm text-gray-500">{`${habit.progress || 0} / ${habit.goal || 1} times`}</p>
                  </div>
                  <button onClick={() => handleProgressUpdate(habit)} className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center active:bg-gray-200 mr-2">
                    <Plus className="w-6 h-6" />
                  </button>
                  <button onClick={() => handleDeleteHabit(habit.id)} className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center active:bg-red-200">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}
            {habits.length === 0 && (
                <p className='text-center text-gray-500 mt-6'>No habits yet. Add one to get started!</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation and Dialog */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-t p-2 flex justify-around items-center rounded-t-3xl border-t border-gray-100 m-2">
        <button className="p-3 text-blue-600 rounded-full active:bg-gray-100"><Home className="w-7 h-7" /></button>
        <button className="p-3 text-gray-400 rounded-full active:bg-gray-100"><Settings className="w-7 h-7" /></button>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center -mt-10 shadow-lg shadow-blue-500/50 active:bg-blue-700">
              <Plus className="w-9 h-9" />
            </button>
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
                placeholder="e.g., Drink 2L of water"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddHabit}>Add Habit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <button className="p-3 text-gray-400 rounded-full active:bg-gray-100"><Bell className="w-7 h-7" /></button>
        <button onClick={handleLogout} className="p-3 text-gray-400 rounded-full active:bg-gray-100"><User className="w-7 h-7" /></button>
      </footer>
    </div>
  );
}
