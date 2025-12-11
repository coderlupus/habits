import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc, collectionGroup, query, where, documentId } from "firebase/firestore";
import { db } from "@/firebase";

// ---------------------------------------------------------------------------
// GET ALL HABITS FOR A USER
// ---------------------------------------------------------------------------
export const getHabits = async (userId) => {
  if (!userId) return [];
  const habitsCollection = collection(db, `users/${userId}/habits`);
  const habitsSnapshot = await getDocs(habitsCollection);
  const habitsList = habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return habitsList;
};

// ---------------------------------------------------------------------------
// GET A SINGLE HABIT (requires userId)
// ---------------------------------------------------------------------------
export const getHabit = async (userId, habitId) => {
  if (!userId) throw new Error("User not authenticated");
  if (!habitId) throw new Error("Habit ID is required");

  const habitRef = doc(db, `users/${userId}/habits`, habitId);
  const snapshot = await getDoc(habitRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

// ---------------------------------------------------------------------------
// ADD A NEW HABIT
// ---------------------------------------------------------------------------
export const addHabit = async (userId, habitData) => {
  if (!userId) throw new Error("User not authenticated");
  const habitsCollection = collection(db, `users/${userId}/habits`);
  const docRef = await addDoc(habitsCollection, habitData);
  return docRef.id;
};

// ---------------------------------------------------------------------------
// UPDATE A HABIT
// ---------------------------------------------------------------------------
export const updateHabit = async (userId, habitId, updatedData) => {
  if (!userId) throw new Error("User not authenticated");
  const habitDoc = doc(db, `users/${userId}/habits`, habitId);
  await updateDoc(habitDoc, updatedData);
};

// ---------------------------------------------------------------------------
// DELETE A HABIT
// ---------------------------------------------------------------------------
export const deleteHabit = async (userId, habitId) => {
  if (!userId) throw new Error("User not authenticated");
  const habitDoc = doc(db, `users/${userId}/habits`, habitId);
  await deleteDoc(habitDoc);
};

// ---------------------------------------------------------------------------
// GET HABIT BY ID WITHOUT KNOWING THE USER (using collectionGroup)
// ---------------------------------------------------------------------------
export const getHabitByIdGlobal = async (habitId) => {
  if (!habitId) throw new Error("Habit ID is required");

  // This query searches across all 'habits' subcollections for a specific document ID.
  const habitsRef = collectionGroup(db, 'habits');
  const q = query(habitsRef, where(documentId(), '==', habitId));
  
  const snap = await getDocs(q);

  if (snap.empty) {
    console.log(`No habit found with ID: ${habitId} in any user's collection.`);
    return null;
  }

  // Assuming habit IDs are unique across all users, we take the first result.
  const docSnap = snap.docs[0];
  
  // Extract the userId from the document's path.
  // The path looks like 'users/{userId}/habits/{habitId}'
  const userId = docSnap.ref.path.split('/')[1];

  return {
    id: docSnap.id,
    userId: userId,
    ...docSnap.data(),
  };
};
