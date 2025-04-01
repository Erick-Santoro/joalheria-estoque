import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "./logo.png"; // substitua pelo nome real da sua logo na pasta 'src'

function RelatorioPDF({ movimentacoes }) {
  const exportarPDF = () => {
    const doc = new jsPDF();

    // Adiciona a logo no topo (base64 ou caminho válido)
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      doc.addImage(img, "PNG", 10, 10, 40, 20);

      doc.setFontSize(18);
      doc.text("Relatório de Movimentações", 70, 20);

      const dados = movimentacoes.map((mov) => [
        mov.tipo,
        mov.nome,
        mov.material,
        mov.quantidade,
        mov.data,
        mov.usuario,
      ]);

      doc.autoTable({
        startY: 40,
        head: [["Tipo", "Nome", "Material", "Quantidade", "Data", "Usuário"]],
        body: dados,
      });

      doc.save("movimentacoes.pdf");
    };
  };

  return (
    <button onClick={exportarPDF} style={{ margin: "10px 0" }}>
      Exportar Movimentações em PDF
    </button>
  );
}

export default RelatorioPDF;
