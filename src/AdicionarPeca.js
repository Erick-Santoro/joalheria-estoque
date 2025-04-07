import React, { useState } from "react";
import { db, storage } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AdicionarPeca({ onPecaAdicionada }) {
  const [nome, setNome] = useState("");
  const [material, setMaterial] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [imagem, setImagem] = useState(null);

  const salvarImagem = async (file) => {
    const nomeUnico = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `imagens/${nomeUnico}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  const adicionar = async () => {
    if (!nome || !material || isNaN(quantidade)) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    let imagemURL = "";

    if (imagem) {
      imagemURL = await salvarImagem(imagem);
    }

    await addDoc(collection(db, "pecas"), {
      nome,
      material,
      quantidade: Number(quantidade),
      imagemURL,
      criadaEm: serverTimestamp(),
    });

    setNome("");
    setMaterial("");
    setQuantidade("");
    setImagem(null);
    onPecaAdicionada();
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3>Adicionar Nova Peça</h3>
      <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input placeholder="Material" value={material} onChange={(e) => setMaterial(e.target.value)} />
      <input placeholder="Quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files[0])} />
      <button onClick={adicionar}>Adicionar</button>
    </div>
  );
}

export default AdicionarPeca;



