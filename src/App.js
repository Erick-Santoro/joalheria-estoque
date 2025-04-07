import React, { useEffect, useState } from "react";
import { signOut, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Login from "./Login";
import AdicionarPeca from "./AdicionarPeca";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [pecas, setPecas] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [filtro, setFiltro] = useState("todas");

  const carregarPecas = async () => {
    const snapshot = await getDocs(collection(db, "pecas"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPecas(lista);
  };

  const carregarMovimentacoes = async () => {
    const q = query(collection(db, "movimentacoes"), orderBy("data", "desc"));
    const snapshot = await getDocs(q);
    const lista = await Promise.all(
      snapshot.docs.map(async (registro) => {
        const data = registro.data();
        const pecaRef = data.pecaId || "";
        const pecaDocRef = pecaRef ? await getDoc(doc(db, "pecas", pecaRef)) : null;
        const nomePeca = pecaDocRef?.exists() ? pecaDocRef.data().nome : "(Peça removida)";
        return { id: registro.id, ...data, nomePeca };
      })
    );
    setMovimentacoes(lista);
  };

  const registrarMovimentacao = async (acao, pecaId, detalhes) => {
    await addDoc(collection(db, "movimentacoes"), {
      pecaId,
      acao,
      detalhes,
      usuario: usuario.user.email,
      data: serverTimestamp(),
    });
  };

  const editarPeca = async (peca) => {
    const novoNome = prompt("Novo nome:", peca.nome);
    const novoMaterial = prompt("Novo material:", peca.material);
    const novaQtd = prompt("Nova quantidade:", peca.quantidade);
    if (!novoNome || !novoMaterial || isNaN(novaQtd)) return;

    await updateDoc(doc(db, "pecas", peca.id), {
      nome: novoNome,
      material: novoMaterial,
      quantidade: Number(novaQtd),
    });
    await registrarMovimentacao("edição", peca.id, `Alterado para: ${novoNome}, ${novoMaterial}, ${novaQtd}`);
    carregarPecas();
  };

  const registrarSaida = async (peca) => {
    const qtd = prompt("Quantidade retirada:");
    const retirada = Number(qtd);
    if (isNaN(retirada) || retirada <= 0 || retirada > peca.quantidade) return;

    await updateDoc(doc(db, "pecas", peca.id), {
      quantidade: peca.quantidade - retirada,
    });
    await registrarMovimentacao("retirada", peca.id, `-${retirada}`);
    carregarPecas();
  };

  const registrarDevolucao = async (peca) => {
    const qtd = prompt("Quantidade devolvida:");
    const devolvida = Number(qtd);
    if (isNaN(devolvida) || devolvida <= 0) return;

    await updateDoc(doc(db, "pecas", peca.id), {
      quantidade: peca.quantidade + devolvida,
    });
    await registrarMovimentacao("devolução", peca.id, `+${devolvida}`);
    carregarPecas();
  };

  const registrarVenda = async (peca) => {
    const qtd = prompt("Quantidade vendida:");
    const vendida = Number(qtd);
    if (isNaN(vendida) || vendida <= 0 || vendida > peca.quantidade) return;

    await updateDoc(doc(db, "pecas", peca.id), {
      quantidade: peca.quantidade - vendida,
    });
    await registrarMovimentacao("venda", peca.id, `-${vendida}`);
    carregarPecas();
  };

  const excluirPeca = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta peça?");
    if (confirmar) {
      await deleteDoc(doc(db, "pecas", id));
      await registrarMovimentacao("exclusão", id, "Peça excluída");
      carregarPecas();
    }
  };

  const fazerLogout = () => {
    signOut(auth).then(() => setUsuario(null));
  };

  const exportarEstoqueCSV = () => {
    const linhas = ["Nome,Material,Quantidade"];
    pecas.forEach((peca) => {
      linhas.push(`${peca.nome},${peca.material},${peca.quantidade}`);
    });
    const blob = new Blob([linhas.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "estoque_atual.csv";
    link.click();
  };

  const exportarEstoquePDF = () => {
    const docPDF = new jsPDF();
    docPDF.setFontSize(16);
    docPDF.text("Relatório de Estoque Atual", 20, 20);
    autoTable(docPDF, {
      startY: 30,
      head: [["Nome", "Material", "Quantidade"]],
      body: pecas.map((p) => [p.nome, p.material, p.quantidade]),
    });
    docPDF.save("estoque_atual.pdf");
  };

  const exportarMovimentacoesCSV = (movs) => {
    const linhas = ["Ação,Peça,Detalhes,Usuário,Data"];
    movs.forEach((mov) => {
      const data = mov.data?.toDate().toLocaleString() || "—";
      linhas.push(`${mov.acao},${mov.nomePeca},${mov.detalhes},${mov.usuario},${data}`);
    });
    const blob = new Blob([linhas.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "movimentacoes.csv";
    link.click();
  };

  const exportarMovimentacoesPDF = (movs) => {
    const docPDF = new jsPDF();
    docPDF.setFontSize(16);
    docPDF.text("Relatório de Movimentações", 20, 20);
    autoTable(docPDF, {
      startY: 30,
      head: [["Ação", "Peça", "Detalhes", "Usuário", "Data"]],
      body: movs.map((m) => [m.acao, m.nomePeca, m.detalhes, m.usuario, m.data?.toDate().toLocaleString() || "—"]),
    });
    docPDF.save("movimentacoes.pdf");
  };

  const registrarVendedora = async () => {
    const email = prompt("E-mail da vendedora:");
    const senha = prompt("Senha:");
    if (!email || !senha) return;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      const uid = cred.user.uid;
      await setDoc(doc(db, "usuarios", uid), {
        email,
        cargo: "vendedora",
      });
      alert("Vendedora cadastrada com sucesso!");
    } catch (err) {
      alert("Erro ao cadastrar: " + err.message);
    }
  };

  useEffect(() => {
    if (usuario) {
      carregarPecas();
      carregarMovimentacoes();
    }
  }, [usuario]);

  if (!usuario) return <Login onLogin={setUsuario} />;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Bem-vindo, {usuario.user.email}</h1>
      <p><strong>Cargo:</strong> {usuario.cargo}</p>
      <button onClick={fazerLogout}>Sair</button>

      {usuario.cargo === "dona" && (
        <>
          <AdicionarPeca onPecaAdicionada={carregarPecas} />
          <button onClick={registrarVendedora}>Cadastrar nova vendedora</button>
          <button onClick={exportarEstoqueCSV}>Exportar Estoque CSV</button>
          <button onClick={exportarEstoquePDF} style={{ marginLeft: 10 }}>Exportar Estoque PDF</button>
        </>
      )}

      <h3>Peças cadastradas:</h3>
      <ul>
        {pecas.map((peca) => (
          <li key={peca.id}>
            {peca.nome} - {peca.material} - {peca.quantidade}
            {usuario.cargo === "dona" && <button onClick={() => editarPeca(peca)}>Editar</button>}
            <button onClick={() => registrarDevolucao(peca)}>Devolver</button>
            <button onClick={() => registrarVenda(peca)}>Vender</button>
            <button onClick={() => registrarSaida(peca)}>Retirar</button>
            {usuario.cargo === "dona" && (
              <button onClick={() => excluirPeca(peca.id)} style={{ color: "red" }}>
                Excluir
              </button>
            )}
          </li>
        ))}
      </ul>

      <h3><span role="img" aria-label="histórico">📋</span> Histórico de Movimentações</h3>
      <label>Filtrar por tipo:</label>
      <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
        <option value="todas">Todas</option>
        <option value="edição">Edição</option>
        <option value="retirada">Retirada</option>
        <option value="devolução">Devolução</option>
        <option value="venda">Venda</option>
        <option value="exclusão">Exclusão</option>
      </select>

      {usuario.cargo === "dona" && (
        <div style={{ margin: "1rem 0" }}>
          <button onClick={() => exportarMovimentacoesCSV(movimentacoes)}>Exportar Movimentações CSV</button>
          <button onClick={() => exportarMovimentacoesPDF(movimentacoes)} style={{ marginLeft: 10 }}>
            Exportar Movimentações PDF
          </button>
        </div>
      )}

      <ul>
        {movimentacoes
          .filter((mov) => filtro === "todas" || mov.acao === filtro)
          .map((mov) => (
            <li key={mov.id}>
              <strong>{mov.acao.toUpperCase()}</strong> | {mov.nomePeca} | {mov.detalhes} | por {mov.usuario} | {mov.data?.toDate().toLocaleString()}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;