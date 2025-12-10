'use server';

import { revalidatePath } from 'next/cache';
import { addHabit, updateHabit, deleteHabit, getHabit } from '@/lib/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/firebase';

// Helper to get current user (você pode adaptar conforme sua auth)
async function getCurrentUserId() {
  // Esta função precisa ser adaptada para funcionar no servidor
  // Por enquanto, vamos passar o userId como parâmetro
  throw new Error('getCurrentUserId must be implemented with server-side auth');
}

export async function addHabitAction(userId, formData) {
  try {
    const habitName = formData.get('name') || formData.name;
    const habitGoal = formData.get('goal') || formData.goal;

    if (!habitName || !userId) {
      return { error: 'Habit name and user ID are required' };
    }

    const habitData = {
      name: habitName,
      goal: parseInt(habitGoal, 10) || 1,
      progress: 0,
      createdAt: new Date(),
      history: []
    };

    await addHabit(userId, habitData);
    revalidatePath('/main');
    
    return { success: true, message: `Habit '${habitName}' added successfully!` };
  } catch (error) {
    console.error('Error adding habit:', error);
    return { error: 'Failed to add habit' };
  }
}

export async function deleteHabitAction(userId, habitId, habitName) {
  try {
    if (!userId || !habitId) {
      return { error: 'User ID and habit ID are required' };
    }

    await deleteHabit(userId, habitId);
    revalidatePath('/main');
    
    return { success: true, message: `Habit '${habitName}' deleted successfully!` };
  } catch (error) {
    console.error('Error deleting habit:', error);
    return { error: 'Failed to delete habit' };
  }
}

export async function updateHabitProgressAction(userId, habitId, currentProgress, goal) {
  try {
    if (!userId || !habitId) {
      return { error: 'User ID and habit ID are required' };
    }

    const newProgress = currentProgress + 1;
    
    if (newProgress > goal) {
      return { error: 'Goal already reached' };
    }

    const updateData = { progress: newProgress };
    
    // Se completou o objetivo, adicionar ao histórico
    if (newProgress === goal) {
      const today = new Date().toISOString().split('T')[0];
      updateData.history = await getHabitHistory(userId, habitId);
      updateData.history.push({ date: today, completed: true });
    }

    await updateHabit(userId, habitId, updateData);
    revalidatePath('/main');
    
    return { 
      success: true, 
      completed: newProgress === goal,
      message: newProgress === goal ? 'Congratulations! Goal completed!' : 'Progress updated!'
    };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { error: 'Failed to update progress' };
  }
}

export async function updateHabitDetailsAction(userId, habitId, formData) {
  try {
    if (!userId || !habitId) {
      return { error: 'User ID and habit ID are required' };
    }

    const name = formData.get('name') || formData.name;
    const goal = formData.get('goal') || formData.goal;

    const updateData = {
      name,
      goal: parseInt(goal, 10) || 1
    };

    await updateHabit(userId, habitId, updateData);
    revalidatePath('/main');
    revalidatePath(`/habits/${habitId}`);
    
    return { success: true, message: 'Habit updated successfully!' };
  } catch (error) {
    console.error('Error updating habit:', error);
    return { error: 'Failed to update habit' };
  }
}

async function getHabitHistory(userId, habitId) {
  try {
    const habit = await getHabit(habitId);
    return habit?.history || [];
  } catch (error) {
    console.error('Error getting habit history:', error);
    return [];
  }
}