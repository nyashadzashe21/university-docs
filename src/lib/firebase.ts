import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCm3eO49zT3rVKuYSGixLjr7EMfM4rF4y4",
  authDomain: "university-docs-51013.firebaseapp.com",
  projectId: "university-docs-51013",
  storageBucket: "university-docs-51013.firebasestorage.app",
  messagingSenderId: "463682503049",
  appId: "1:463682503049:web:ba7b1eb89bbf3054e86158",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
