'use client';

import { useState, useTransition } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Pencil, Droplet, Footprints, Leaf, Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link'; // Importando o Link
import { 
  deleteHabitAction, 
  updateHabitProgressAction, 
  updateHabitDetailsAction 
} from '@/app/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

export default function HabitListClient({ habits, userId }) {
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState(null);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleProgressUpdate = (e, habit) => {
    e.preventDefault(); // Impede a navegação
    setPendingAction({ action: 'progress', habitId: habit.id });
    startTransition(async () => {
      const result = await updateHabitProgressAction(
        userId, 
        habit.id, 
        habit.progress || 0, 
        habit.goal
      );
      
      if (result.success) {
        if (result.completed) {
          toast.success(result.message);
        }
      } else {
        toast.error(result.error);
      }
      setPendingAction(null);
    });
  };

  const handleDelete = (e, habitId, habitName) => {
    e.preventDefault(); // Impede a navegação
    setPendingAction({ action: 'delete', habitId });
    startTransition(async () => {
      const result = await deleteHabitAction(userId, habitId, habitName);
      
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
      setPendingAction(null);
    });
  };

  const handleEdit = (e, habit) => {
    e.preventDefault(); // Impede a navegação
    setEditingHabit(habit);
    setIsEditDialogOpen(true);
  };

  const handleUpdateHabit = () => {
    setPendingAction({ action: 'edit', habitId: editingHabit.id });
    startTransition(async () => {
      const result = await updateHabitDetailsAction(
        userId, 
        editingHabit.id, 
        {
          name: editingHabit.name,
          goal: editingHabit.goal
        }
      );
      
      if (result.success) {
        toast.success(result.message);
        setIsEditDialogOpen(false);
        setEditingHabit(null);
      } else {
        toast.error(result.error);
      }
      setPendingAction(null);
    });
  };

  if (habits.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 mt-6 bg-gray-50 border-2 border-dashed border-gray-200">
        <Target className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800">No Habits Yet</h3>
        <p className="text-sm text-gray-500 mb-6">Ready to build a better you? Start by adding your first habit.</p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {habits.map((habit) => {
            const isUpdatingProgress = (isPending || pendingAction) && pendingAction?.action === 'progress' && pendingAction?.habitId === habit.id;
            const isDeleting = (isPending || pendingAction) && pendingAction?.action === 'delete' && pendingAction?.habitId === habit.id;
            const isAnyActionPending = isPending || pendingAction;

            return (
              <Link href={`/habits/${habit.id}`} key={habit.id} className="block">
                <Card className="p-4 rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      {getHabitIcon(habit.name)}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{habit.name}</p>
                      <p className="text-sm text-gray-500">{`${habit.progress || 0} / ${habit.goal || 1} times`}</p>
                    </div>
                    <button 
                      onClick={(e) => handleProgressUpdate(e, habit)} 
                      className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center active:bg-gray-200 mr-2 disabled:opacity-50" 
                      disabled={isAnyActionPending || habit.progress >= habit.goal}
                    >
                      {isUpdatingProgress ? <Loader2 className="w-6 h-6 animate-spin text-gray-800" /> : <Plus className="w-6 h-6" />}
                    </button>
                    <button 
                      onClick={(e) => handleEdit(e, habit)} 
                      className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center active:bg-blue-200 mr-2"
                      disabled={isAnyActionPending}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, habit.id, habit.name)} 
                      className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center active:bg-red-200"
                      disabled={isAnyActionPending}
                    >
                      {isDeleting ? <Loader2 className="w-5 h-5 animate-spin text-gray-800" /> : <Trash2 className="w-5 h-5" />}
                    </button>
                  </div>
                </Card>
              </Link>
            );
        })}
      </div>

      {/* Edit Dialog */}
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
              <Button onClick={handleUpdateHabit} disabled={isPending || pendingAction?.action === 'edit'}>
                {(isPending || pendingAction) && pendingAction?.action === 'edit' && <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-800" />}
                {(isPending || pendingAction) && pendingAction?.action === 'edit' ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}