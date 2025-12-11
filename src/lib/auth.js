// src/lib/auth.js

import { getAuth } from "firebase/auth";
import { app } from "@/firebase";

export async function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = getAuth(app).onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}
