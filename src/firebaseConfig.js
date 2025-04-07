// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAok8XnM7MIsvnjT0wIuAllJjZkXviAjzc",
  authDomain: "joalheria-estoque.firebaseapp.com",
  projectId: "joalheria-estoque",
  storageBucket: "joalheria-estoque.appspot.com",
  messagingSenderId: "578426668752",
  appId: "1:578426668752:web:830ffd30686ceb9b9140d5",
  measurementId: "G-9614FXL9R7"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços usados no app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
