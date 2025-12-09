import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Assuming you have a firebase config file

// Function to get habits for a specific user
export const getHabits = async (userId) => {
  if (!userId) return [];
  const habitsCollection = collection(db, `users/${userId}/habits`);
  const habitsSnapshot = await getDocs(habitsCollection);
  const habitsList = habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return habitsList;
};

// Function to add a new habit
export const addHabit = async (userId, habitData) => {
  if (!userId) throw new Error("User not authenticated");
  const habitsCollection = collection(db, `users/${userId}/habits`);
  await addDoc(habitsCollection, habitData);
};

// Function to update a habit
export const updateHabit = async (userId, habitId, updatedData) => {
  if (!userId) throw new Error("User not authenticated");
  const habitDoc = doc(db, `users/${userId}/habits`, habitId);
  await updateDoc(habitDoc, updatedData);
};

// Function to delete a habit
export const deleteHabit = async (userId, habitId) => {
  if (!userId) throw new Error("User not authenticated");
  const habitDoc = doc(db, `users/${userId}/habits`, habitId);
  await deleteDoc(habitDoc);
};
