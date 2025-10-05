// src/utils/db.js
import { openDB } from "idb";

const DB_NAME = "user-profile-db";
const STORE_NAME = "profile";
const DB_VERSION = 1;

// This function initializes the database and creates the object store if needed.
const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });
  return db;
};

// Function to save (add or update) user data.
export const saveUserDataToDB = async (data) => {
  const db = await initDB();
  // We use a static ID of 1 since we're only saving a single user profile.
  // The 'put' method will add the object if it doesn't exist or update it if it does.
  await db.put(STORE_NAME, { ...data, id: 1 });
};

// Function to retrieve the user data.
export const getUserDataFromDB = async () => {
  const db = await initDB();
  // We retrieve the profile using its static ID of 1.
  return await db.get(STORE_NAME, 1);
};
