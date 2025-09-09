import React, { useState } from "react";
import { Table, Badge } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { MdAssignment } from "react-icons/md";

const estados = [
  { label: "Atendido", text: "A", variant: "success" },
  { label: "Não Atendido", text: "NA", variant: "danger" },
  { label: "Parcialmente", text: "PA", variant: "warning" },
  { label: "Não Avaliado", text: "", variant: "secondary" },
];

const AvaliacaoEstudante = ({ matriz, onSalvar, onSelecionarAtividade }) => {
  if (!matriz || !matriz.ucs) {
    return <div>Carregando dados de avaliação...</div>;
  }

  const [estadoMatriz, setEstadoMatriz] = useState(() =>
    matriz.ucs.map(uc => uc.indicadores.map(() => 3)) // 3 = "Não Avaliado"
  );

  const handleClick = (ucIndex, indIndex) => {
    setEstadoMatriz(prev => {
      const novaMatriz = [...prev];
      novaMatriz[ucIndex] = [...novaMatriz[ucIndex]];
      novaMatriz[ucIndex][indIndex] =
        (novaMatriz[ucIndex][indIndex] + 1) % estados.length;
      return novaMatriz;
    });
  };

  const maxIndicadores = Math.max(
    ...matriz.ucs.map(uc => uc.indicadores.length)
  );

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
                {Array.from({ length: maxIndicadores }, (_, indIndex) => {
                  const indicador = uc.indicadores[indIndex];
                  const estadoIndex = estadoMatriz[ucIndex]?.[indIndex];
                  const estado = estados[estadoIndex];

                  return (
                    <td key={indIndex}>
                      {indicador ? (
                        <div
                          className="d-flex"
                          style={{ height: "100%", alignItems: "center" }}
                        >
                          {/* Esquerda: Estado */}
                          <div
                            className="flex-grow-1 d-flex justify-content-center align-items-center"
                            onClick={() => handleClick(ucIndex, indIndex)}
                            style={{ cursor: "pointer" }}
                          >
                            <Badge bg={estado.variant}>
                              {estado.text || " "}
                            </Badge>
                          </div>

                          {/* Linha divisória */}
                          <div
                            style={{
                              width: "1px",
                              backgroundColor: "#dee2e6",
                              margin: "0 6px",
                              alignSelf: "stretch",
                            }}
                          ></div>

                          {/* Direita: Ícones */}
                          <div className="d-flex gap-2 justify-content-end align-items-center">
                            <FaSave
                              style={{ cursor: "pointer", color: "#0d6efd" }}
                              onClick={() =>
                                onSalvar?.(uc.id_uc, indicador.id_indicador, estado)
                              }
                              title="Salvar"
                            />
                            <MdAssignment
                              style={{ cursor: "pointer", color: "gray" }}
                              onClick={() =>
                                onSelecionarAtividade?.(
                                  uc.id_uc,
                                  indicador.id_indicador
                                )
                              }
                              title="Selecionar Atividade"
                            />
                          </div>
                        </div>
                      ) : null}
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
