import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

function Registrar() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("vendedora"); // valor padrão
  const [mensagem, setMensagem] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensagem("");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = userCred.user.uid;
    
      console.log("✅ Usuário criado com UID:", uid);
      console.log("🔧 Salvando no Firestore com cargo:", cargo);
    
      await setDoc(doc(db, "usuarios", uid), {
        email: email,
        cargo: cargo,
      });
    
      console.log("✅ Documento salvo no Firestore com sucesso!");
    
      setMensagem("✅ Usuário registrado e cargo salvo!");
      setEmail("");
      setSenha("");
      setCargo("vendedora");
    } catch (error) {
      console.error("❌ Erro ao registrar:", error);
      setMensagem("Erro ao registrar usuário.");    
    }
  };

  return (
    <div>
      <h2>Registrar novo usuário</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <br />
        <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
          <option value="dona">Dona</option>
          <option value="vendedora">Vendedora</option>
        </select>
        <br />
        <button type="submit">Registrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default Registrar;