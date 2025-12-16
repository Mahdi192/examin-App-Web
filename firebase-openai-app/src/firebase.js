import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDal3pUj2eYvM33rwFB2okdhdNTaFr48OY",
  authDomain: "examin-final.firebaseapp.com",
  projectId: "examin-final",
  storageBucket: "examin-final.appspot.com", // ⚠️ IMPORTANT
  messagingSenderId: "540518466556",
  appId: "1:540518466556:web:d49e4b799a12f809a6e879",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ✅ CE QUI MANQUAIT
export const db = getFirestore(app);
