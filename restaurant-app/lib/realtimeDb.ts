// Real-time database for location tracking (faster than Firestore for frequent updates)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, set, onValue, off, update } from "firebase/database";
import firebaseConfig from "./firebaseConfig";

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const realtimeDb = getDatabase(firebaseApp);

export { realtimeDb, ref, set, onValue, off, update };
