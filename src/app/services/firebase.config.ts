import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyCHgunfsH_abgoP8TIVCUp7HVI_2Jsg_UA",
  authDomain: "hackathon-17839.firebaseapp.com",
  projectId: "hackathon-17839",
  storageBucket: "hackathon-17839.firebasestorage.app",
  messagingSenderId: "154908484386",
  appId: "1:154908484386:web:f2574bc5d68571f62f7b7b",
  measurementId: "G-Z9ST42RD9B"
};

// Initialize Firebase App singleton safely
let appInstance: FirebaseApp;

if (!getApps().length) {
  appInstance = initializeApp(firebaseConfig);
} else {
  appInstance = getApp();
}

export const app = appInstance;
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);

// Initialize analytics only in browser if supported
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.warn('Analytics initialization skipped:', e);
      }
    }
  }).catch(() => {
    // Ignore analytics unsupported in some iframe environments
  });
}
