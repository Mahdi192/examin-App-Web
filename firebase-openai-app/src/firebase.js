import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyDal3pUj2eYvM33rwFB2okdhdNTaFr48OY",
  authDomain: "examin-final.firebaseapp.com",
  projectId: "examin-final",
  storageBucket: "examin-final.firebasestorage.app", // ✅ IMPORTANT : .appspot.com
  messagingSenderId: "540518466556",
  appId: "1:540518466556:web:d49e4b799a12f809a6e879",
};

export const app = initializeApp(firebaseConfig);

// ✅ Services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ✅ App Check (reCAPTCHA v3)
const siteKey = import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY;

if (siteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true,
  });
} else {
  console.warn("App Check désactivé: VITE_RECAPTCHA_V3_SITE_KEY manquant.");
}
