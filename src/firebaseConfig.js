import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
const firebaseConfig = {
  apiKey: "AIzaSyAok8XnM7MIsvnjT0wIuAllJjZkXviAjzc",
  authDomain: "joalheria-estoque.firebaseapp.com",
  projectId: "joalheria-estoque",
  storageBucket: "joalheria-estoque.firebasestorage.app",
  messagingSenderId: "578426668752",
  appId: "1:578426668752:web:830ffd30686ceb9b9140d5",
  measurementId: "G-9614FXL9R7"
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

export { db, auth }; 