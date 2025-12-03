import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Get habits for a specific user
export const getHabits = async (userId) => {
  if (!userId) return [];
  try {
    const habitsRef = collection(db, "habits");
    const q = query(habitsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting habits:", error);
    throw error;
  }
};

// Add a new habit with a specific goal
export const addHabit = async (userId, habit) => {
  if (!userId) return;
  try {
    await addDoc(collection(db, "habits"), {
      userId: userId,
      name: habit.name,
      goal: habit.goal || 1, // Default goal to 1 if not provided
      progress: 0, // Always start progress at 0
    });
  } catch (error) {
    console.error("Error adding habit: ", error);
    throw error;
  }
};

// Update an existing habit's progress
export const updateHabit = async (habitId, newProgress) => {
  try {
    const habitDoc = doc(db, "habits", habitId);
    await updateDoc(habitDoc, { progress: newProgress });
  } catch (error) {
    console.error("Error updating habit: ", error);
    throw error;
  }
};

// Delete a habit
export const deleteHabit = async (habitId) => {
  try {
    const habitDoc = doc(db, "habits", habitId);
    await deleteDoc(habitDoc);
  } catch (error) {
    console.error("Error deleting habit: ", error);
    throw error;
  }
};
