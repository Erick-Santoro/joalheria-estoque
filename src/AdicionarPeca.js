import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebaseConfig";

function AdicionarPeca({ onPecaAdicionada }) {
  const [nome, setNome] = useState("");
  const [material, setMaterial] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [imagem, setImagem] = useState(null);

  const handleAdicionar = async () => {
    if (!nome || !material || isNaN(quantidade)) return;

    let imagemURL = "";

    if (imagem) {
      const storageRef = ref(storage, `imagens/${Date.now()}-${imagem.name}`);
      await uploadBytes(storageRef, imagem);
      imagemURL = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "pecas"), {
      nome,
      material,
      quantidade: Number(quantidade),
      imagemURL,
      criadoEm: serverTimestamp(),
    });

    setNome("");
    setMaterial("");
    setQuantidade(0);
    setImagem(null);
    onPecaAdicionada();
  };

  return (
    <div>
      <h3>Adicionar nova peça</h3>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="text"
        placeholder="Material"
        value={material}
        onChange={(e) => setMaterial(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantidade"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImagem(e.target.files[0])}
      />
      <button onClick={handleAdicionar}>Adicionar Peça</button>
    </div>
  );
}

export default AdicionarPeca;






