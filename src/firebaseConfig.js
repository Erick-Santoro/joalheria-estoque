import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAok8XnM7MIsvnjT0wIuAllJjZkXviAjzc",
  authDomain: "joalheria-estoque.firebaseapp.com",
  projectId: "joalheria-estoque",
  storageBucket: "joalheria-estoque.firebasestorage.app", // corrigido aqui
  messagingSenderId: "578426668752",
  appId: "1:578426668752:web:830ffd30686ceb9b9140d5",
  measurementId: "G-9614FXL9R7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // <- importante!

export { auth, db, storage };
