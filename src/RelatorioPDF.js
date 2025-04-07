import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function gerarRelatorioPDF(pecas) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Relatório de Estoque", 14, 22);

  autoTable(doc, {
    startY: 30,
    head: [["Nome", "Material", "Quantidade"]],
    body: pecas.map((p) => [p.nome, p.material, p.quantidade]),
  });

  doc.save("relatorio_estoque.pdf");
}

export default gerarRelatorioPDF;

