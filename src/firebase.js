import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5DwvoIRRoD9Q684J_p3Cxrh9ssb_snD0",
  authDomain: "drezy-tracker.firebaseapp.com",
  projectId: "drezy-tracker",
  storageBucket: "drezy-tracker.firebasestorage.app",
  messagingSenderId: "919144559433",
  appId: "1:919144559433:web:93bdeb769b9d782c45a098"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
