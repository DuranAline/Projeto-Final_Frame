// src/services/firebaseConnection.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWX-taISy8G3doO1dFpkhwNl8pcvS5HO0",
  authDomain: "projeto-f-a7584.firebaseapp.com",
  projectId: "projeto-f-a7584",
  storageBucket: "projeto-f-a7584.appspot.com",
  messagingSenderId: "375048968982",
  appId: "1:375048968982:web:3b90f442b51566e88c8e37"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
