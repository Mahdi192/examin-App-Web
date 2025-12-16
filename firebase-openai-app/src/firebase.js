import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Ta config (tu l’as déjà)
const firebaseConfig = {
  apiKey: "AIzaSyDal3pUj2eYvM33rwFB2okdhdNTaFr48OY",
  authDomain: "examin-final.firebaseapp.com",
  projectId: "examin-final",
  storageBucket: "examin-final.firebasestorage.app",
  messagingSenderId: "540518466556",
  appId: "1:540518466556:web:d49e4b799a12f809a6e879",
  measurementId: "G-EGBXDLM3Q8"
};

export const app = initializeApp(firebaseConfig);

// ✅ IMPORTANT : c’est ça qui manquait
export const auth = getAuth(app);
