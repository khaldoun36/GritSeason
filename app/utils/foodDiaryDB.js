// src/utils/foodDiaryDB.js
import { openDB } from "idb";

const DB_NAME = "food-diary-db";
const STORE_NAME = "foodLog";
const DB_VERSION = 1;

/**
 * Initializes the database and creates the object store for food entries.
 */
const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id", // Use the unique string ID as the key
        });
        // Create an index on 'timestamp' to allow for efficient date-based queries
        store.createIndex("by-timestamp", "timestamp");
      }
    },
  });
  return db;
};

/**
 * Saves a single food entry to the database.
 * The 'put' method adds a new item or updates an existing one.
 * @param {object} entry - The food entry object to save.
 */
export const saveFoodEntryToDB = async (entry) => {
  const db = await initDB();
  await db.put(STORE_NAME, entry);
};

/**
 * Retrieves all food entries from the database.
 * @returns {Promise<Array>} A promise that resolves to an array of all food entries.
 */
export const getFoodLogFromDB = async () => {
  const db = await initDB();
  // We can sort by timestamp directly from the database using the index
  return await db.getAllFromIndex(STORE_NAME, "by-timestamp");
};

/**
 * Deletes a food entry from the database using its unique ID.
 * @param {string} id - The ID of the food entry to remove.
 */
export const removeFoodEntryFromDB = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};
