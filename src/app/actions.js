'use server';

import { revalidatePath } from 'next/cache';
import { addHabit, getHabits, updateHabit, deleteHabit } from '@/lib/firestore';
import { auth } from '@/app/auth';
import { cookies } from 'next/headers';

async function getUserId() {
    const session = cookies().get('session');
    if (!session) return null;
    const { user } = await auth.validateSession(session.value);
    return user?.userId;
}

export async function addHabitAction(formData) {
    const userId = await getUserId();
    if (!userId) {
        return { error: "User not authenticated" };
    }

    const habitName = formData.get('habit-name');
    const habitGoal = formData.get('habit-goal');

    if (!habitName) {
        return { error: "Habit name is required." };
    }

    try {
        await addHabit(userId, {
            name: habitName,
            goal: parseInt(habitGoal, 10) || 1, // Default goal to 1 if not specified
            completedDays: {},
        });
        revalidatePath('/main');
        return { success: "Habit added successfully!" };
    } catch (error) {
        return { error: "Failed to add habit." };
    }
}

// The other action functions (get, update, delete) can be similarly wrapped
// if you need to call them from client components via server actions.
