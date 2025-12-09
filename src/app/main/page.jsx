'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '@/firebase';
import { getHabits, addHabit, deleteHabit, updateHabit } from '@/lib/firestore';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User, Droplet, Footprints, Leaf, Trash2, Pencil, Target } from 'lucide-react';
import { toast } from 'sonner';
import RecommendedHabits from '@/components/recommended-habits';

const habitIcons = {
  water: <Droplet className="w-6 h-6 text-blue-500" />,
  walk: <Footprints className="w-6 h-6 text-orange-500" />,
  run: <Footprints className="w-6 h-6 text-orange-500" />,
  plant: <Leaf className="w-6 h-6 text-green-500" />,
  read: <Droplet className="w-6 h-6 text-purple-500" />,
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

export default function MainPage() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [newHabitGoal, setNewHabitGoal] = useState('1');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [dates, setDates] = useState([]);
  const router = useRouter();
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchHabits(currentUser.uid);
      } else {
        router.push('/');
      }
    });

    // Dynamic Calendar
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

  const fetchHabits = async (uid) => {
    if (!uid) return;
    const userHabits = await getHabits(uid);
    setHabits(userHabits);
  };

  const handleAddHabit = async (habitName) => {
    const name = habitName || newHabit;
    if (name.trim() === '' || !user) return;
    try {
      const goal = parseInt(newHabitGoal, 10);
      await addHabit(user.uid, { name, goal: isNaN(goal) || goal < 1 ? 1 : goal });
      toast.success(`Habit '${name}' added!`);
      setNewHabit('');
      setNewHabitGoal('1');
      await fetchHabits(user.uid);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding habit:', error);
      toast.error('Failed to add habit.');
    }
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setIsEditDialogOpen(true);
  };

  const handleUpdateHabit = async () => {
    if (!editingHabit || !user) return;

    try {
      await updateHabit(user.uid, editingHabit.id, { name: editingHabit.name, goal: editingHabit.goal });
      toast.success(`Habit '${editingHabit.name}' updated!`);
      await fetchHabits(user.uid);
      setIsEditDialogOpen(false);
      setEditingHabit(null);
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit.');
    }
  };

  const handleDeleteHabit = async (habitId, habitName) => {
    if (!user) return;
    try {
      await deleteHabit(user.uid, habitId);
      toast.success(`Habit '${habitName}' deleted!`);
      await fetchHabits(user.uid);
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit.');
    }
  };

  const handleProgressUpdate = async (habit) => {
    if (!user) return;
    const newProgress = (habit.progress || 0) + 1;
    if (newProgress > habit.goal) return;

    try {
      await updateHabit(user.uid, habit.id, { progress: newProgress });
      if (newProgress === habit.goal) {
        toast.success(`Congratulations! You\'ve completed the '${habit.name}' habit for today!`);
      }
      await fetchHabits(user.uid);
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update habit progress.');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  const completedHabits = habits.filter(h => h.progress >= h.goal).length;
  const totalHabits = habits.length;
  const dailyProgressPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

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

          <Card className="bg-blue-600 text-white p-5 rounded-2xl mb-6 shadow-lg shadow-blue-500/20">
              <div className="flex items-center">
                  <div className="relative w-12 h-12 mr-4">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="4" />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffffff" strokeWidth="4" strokeDasharray={`${dailyProgressPercentage}, 100`} />
                      </svg>
                      <p className="absolute inset-0 flex items-center justify-center text-xs font-bold">{dailyProgressPercentage}%</p>
                  </div>
                  <div>
                      <h2 className="font-bold text-base">Your daily goals almost done! &#128293;</h2>
                      <p className="text-sm opacity-80">{completedHabits} of {totalHabits} completed</p>
                  </div>
              </div>
          </Card>

          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg text-gray-900">Habits</h3>
              <a href="#" className="text-blue-600 text-sm font-semibold">VIEW ALL</a>
            </div>
            <div className="space-y-3">
              {habits.length > 0 ? (
                habits.map((habit) => (
                  <Card key={habit.id} className="p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center">
                      <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        {getHabitIcon(habit.name)}
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">{habit.name}</p>
                        <p className="text-sm text-gray-500">{`${habit.progress || 0} / ${habit.goal || 1} times`}</p>
                      </div>
                      <button onClick={() => handleProgressUpdate(habit)} className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center active:bg-gray-200 mr-2 disabled:opacity-50" disabled={habit.progress >= habit.goal}>
                        <Plus className="w-6 h-6" />
                      </button>
                      <button onClick={() => handleEditHabit(habit)} className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center active:bg-blue-200 mr-2">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteHabit(habit.id, habit.name)} className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center active:bg-red-200">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </Card>
                ))
              ) : (
                  <Card className="flex flex-col items-center justify-center p-10 mt-6 bg-gray-50 border-2 border-dashed border-gray-200">
                      <Target className="w-12 h-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800">No Habits Yet</h3>
                      <p className="text-sm text-gray-500 mb-6">Ready to build a better you? Start by adding your first habit.</p>
                      <DialogTrigger asChild>
                          <Button>Add a Habit</Button>
                      </DialogTrigger>
                  </Card>
              )}
            </div>

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
              <Button onClick={() => handleAddHabit()}>Add Habit</Button>
            </DialogFooter>
          </DialogContent>
        </footer>

        {/* Edit Habit Dialog */}
        {editingHabit && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Habit</DialogTitle>
                <DialogDescription>Make changes to your habit.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="edit-habit-name">Name</Label>
                  <Input
                    id="edit-habit-name"
                    value={editingHabit.name}
                    onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-habit-goal">Goal (times per day)</Label>
                  <Input
                    id="edit-habit-goal"
                    type="number"
                    min="1"
                    value={editingHabit.goal}
                    onChange={(e) => setEditingHabit({ ...editingHabit, goal: parseInt(e.target.value, 10) || 1 })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdateHabit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Dialog>
  );
}
