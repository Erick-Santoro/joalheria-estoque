import React from "react";
import { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function AdicionarPeca({ onPecaAdicionada }) {
  const [nome, setNome] = useState("");
  const [material, setMaterial] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [mensagem, setMensagem] = useState("");

  const handleAdicionar = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "pecas"), {
        nome,
        material,
        quantidade: Number(quantidade),
        criadaEm: serverTimestamp(),
      });

      setMensagem("✅ Peça adicionada com sucesso!");
      setNome("");
      setMaterial("");
      setQuantidade(1);

      if (onPecaAdicionada) {
        onPecaAdicionada();
      }
    } catch (error) {
      console.error("❌ Erro ao adicionar peça:", error);
      setMensagem("Erro ao adicionar peça.");
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3>Adicionar Nova Peça</h3>
      <form onSubmit={handleAdicionar}>
        <input
          type="text"
          placeholder="Nome da peça"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Material"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />
        <button type="submit">Adicionar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default AdicionarPeca;
