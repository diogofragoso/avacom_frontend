import React, { useState } from "react";
import { Table, Badge } from "react-bootstrap";

const estados = [
  { label: "Atendido", text: "A", variant: "success" },
  { label: "Não Atendido", text: "NA", variant: "danger" },
  { label: "Parcialmente", text: "PA", variant: "warning" },
  { label: "Não Avaliado", text: "", variant: "secondary" },
];

const AvaliacaoEstudante = ({ ucs = 10, indicadores = 9 }) => {
  // matriz inicial preenchida como "Não Avaliado"
  const [matriz, setMatriz] = useState(
    Array.from({ length: ucs }, () =>
      Array.from({ length: indicadores }, () => 3) // 3 = "Não Avaliado"
    )
  );

  // alterna estado ao clicar
  const handleClick = (ucIndex, indIndex) => {
    setMatriz((prev) => {
      const novaMatriz = prev.map((row) => [...row]);
      novaMatriz[ucIndex][indIndex] =
        (novaMatriz[ucIndex][indIndex] + 1) % estados.length;
      return novaMatriz;
    });
  };

  return (
    <div className="p-3">
      {/* Legenda */}
      <div className="d-flex gap-3 mb-3">
        {estados.map((estado, idx) => (
          <div key={idx} className="d-flex align-items-center gap-2">
            <Badge bg={estado.variant}>{estado.text || " "}</Badge>
            <span>{estado.label}</span>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ overflowX: "auto" }}>
        <Table bordered responsive>
          <thead>
            <tr>
              <th style={{ backgroundColor: "#0d6efd", color: "white" }}>UC</th>
              {Array.from({ length: indicadores }, (_, i) => (
                <th
                  key={i}
                  style={{ backgroundColor: "#0d6efd", color: "white" }}
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matriz.map((row, ucIndex) => (
              <tr key={ucIndex}>
                <td
                  style={{
                    backgroundColor: "#0d6efd",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  UC{ucIndex + 1}
                </td>
                {row.map((estadoIndex, indIndex) => {
                  const estado = estados[estadoIndex];
                  return (
                    <td
                      key={indIndex}
                      className="text-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleClick(ucIndex, indIndex)}
                    >
                      <Badge bg={estado.variant}>{estado.text || " "}</Badge>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AvaliacaoEstudante;
