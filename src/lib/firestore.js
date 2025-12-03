import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "./firebase";

// Get habits for a specific user from the main 'habits' collection
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

// Add a new habit for a specific user, including the userId field
export const addHabit = async (userId, habit) => {
  if (!userId) return;
  try {
    await addDoc(collection(db, "habits"), {
      ...habit,
      userId: userId, // Add the userId to the habit document
    });
  } catch (error) {
    console.error("Error adding habit: ", error);
    throw error;
  }
};

// Delete a habit by its document ID
export const deleteHabit = async (habitId) => {
  try {
    const habitDoc = doc(db, "habits", habitId);
    await deleteDoc(habitDoc);
  } catch (error) {
    console.error("Error deleting habit: ", error);
    throw error;
  }
};
