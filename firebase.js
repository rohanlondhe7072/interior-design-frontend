/**
 * firebase.js - Firebase v10 Modular SDK Initialization
 * 
 * This module initializes Firebase once and exports the database instance.
 * It must be imported at the top of any file that uses Firebase.
 */

console.log('%c🔥 Firebase Initializing...', 'color: orange; font-weight: bold;');

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, push, update, onValue, remove, query, orderByChild, equalTo, get } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyApRFxmTfn_0BWNiP1kikyyX8RAr4TN3Uw",
  authDomain: "interior-design-3c5de.firebaseapp.com",
  databaseURL: "https://interior-design-3c5de-default-rtdb.firebaseio.com",
  projectId: "interior-design-3c5de",
  storageBucket: "interior-design-3c5de.firebasestorage.app",
  messagingSenderId: "575024906321",
  appId: "1:575024906321:web:ba480436da61a4dc657870"
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
  throw new Error('❌ Invalid Firebase configuration - missing required keys');
}

console.log('✅ Firebase Config valid');

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase App initialized');

// Get Database Reference
const db = getDatabase(app);
console.log('✅ Database reference created');
console.log('%c✅ FIREBASE READY', 'color: green; font-weight: bold; font-size: 14px;');

// Export for use in other modules
export { db, ref, push, update, onValue, remove, query, orderByChild, equalTo, get };
