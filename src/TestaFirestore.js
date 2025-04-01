import React from "react";
import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

function TestaFirestore() {
  const handleTestar = async () => {
    try {
      const fakeUID = "teste-uid-123";
      await setDoc(doc(db, "usuarios", fakeUID), {
        email: "teste@exemplo.com",
        cargo: "dona",
      });

      alert("✅ Documento criado no Firestore!");
    } catch (error) {
      console.error("❌ Erro ao criar documento:", error);
      alert("Erro ao salvar no Firestore. Veja o console.");
    }
  };

  return (
    <div>
      <h2>Teste rápido de conexão com o Firestore</h2>
      <button onClick={handleTestar}>Criar documento de teste</button>
    </div>
  );
}

export default TestaFirestore;
