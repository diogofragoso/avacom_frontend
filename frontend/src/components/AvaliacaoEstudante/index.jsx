import React, { useState } from "react";
import { Table, Badge } from "react-bootstrap";

const estados = [
  { label: "Atendido", text: "A", variant: "success" },
  { label: "Não Atendido", text: "NA", variant: "danger" },
  { label: "Parcialmente", text: "PA", variant: "warning" },
  { label: "Não Avaliado", text: "", variant: "secondary" },
];

const AvaliacaoEstudante = ({ matriz }) => {
  // Retorna uma mensagem de carregamento se a matriz ainda não estiver disponível
  if (!matriz || !matriz.ucs) {
    return <div>Carregando dados de avaliação...</div>;
  }

  // Criar uma matriz de estados inicial baseada na estrutura de UCs e indicadores
  const [estadoMatriz, setEstadoMatriz] = useState(() => {
    return matriz.ucs.map(uc => {
      // Para cada UC, cria uma linha de estados para seus indicadores
      return uc.indicadores.map(() => 3); // 3 = "Não Avaliado"
    });
  });

  // Função para lidar com o clique e alternar o estado de uma célula
  const handleClick = (ucIndex, indIndex) => {
    setEstadoMatriz(prev => {
      const novaMatriz = [...prev];
      novaMatriz[ucIndex] = [...novaMatriz[ucIndex]];
      novaMatriz[ucIndex][indIndex] = (novaMatriz[ucIndex][indIndex] + 1) % estados.length;
      return novaMatriz;
    });
  };

  // Encontra o maior número de indicadores para definir o número de colunas
  const maxIndicadores = Math.max(...matriz.ucs.map(uc => uc.indicadores.length));

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
              {/* Renderiza as colunas de indicadores com base no maior número de indicadores */}
              {Array.from({ length: maxIndicadores }, (_, i) => (
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
            {/* Renderiza as linhas dinamicamente com base nas UCs */}
            {matriz.ucs.map((uc, ucIndex) => (
              <tr key={uc.id_uc}>
                <td
                  style={{
                    backgroundColor: "#0d6efd",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  UC{uc.numero_uc}
                </td>
                {/* Renderiza as células de avaliação para os indicadores da UC */}
                {Array.from({ length: maxIndicadores }, (_, indIndex) => {
                  const indicador = uc.indicadores[indIndex];
                  const estadoIndex = estadoMatriz[ucIndex]?.[indIndex];
                  const estado = estados[estadoIndex];
                  
                  // Renderiza a célula se o indicador existir, senão, uma célula vazia
                  return (
                    <td
                      key={indIndex}
                      className="text-center"
                      style={{ cursor: indicador ? "pointer" : "default" }}
                      onClick={indicador ? () => handleClick(ucIndex, indIndex) : undefined}
                    >
                      {indicador && <Badge bg={estado.variant}>{estado.text || " "}</Badge>}
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
