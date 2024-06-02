import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAwmvzPFU8wBpEzeRAmGOa_xk-n_cpN_fU",
  authDomain: "projeto-final-1494f.firebaseapp.com",
  projectId: "projeto-final-1494f",
  storageBucket: "projeto-final-1494f.appspot.com",
  messagingSenderId: "121896142634",
  appId: "1:121896142634:web:6b6a8c22709d2547f70053",
  measurementId: "G-P4J58XQTL5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
