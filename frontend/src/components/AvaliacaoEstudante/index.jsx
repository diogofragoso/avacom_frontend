import React, { useState } from "react";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { MdAssignment, MdComment } from "react-icons/md";

const estados = [
  { label: "Atendido", text: "A", variant: "success" },
  { label: "Não Atendido", text: "NA", variant: "danger" },
  { label: "Parcialmente", text: "PA", variant: "warning" },
  { label: "Não Avaliado", text: "", variant: "secondary" },
];

const AvaliacaoEstudante = ({
  matriz,
  atividades = [],
  idCurso,       // <-- Novo prop
  idTurma,       // <-- Novo prop
  idEstudante,   // <-- Novo prop
  estudanteId,
  turmaId,
  avaliacaoId, // id da avaliação ou matrícula
  onSalvar,
  onSalvarTodos,
  onSelecionarAtividade,
  onObservacao,
}) => {
  if (!matriz || !matriz.ucs) {
    return <div>Carregando dados de avaliação...</div>;
  }

  const [estadoMatriz, setEstadoMatriz] = useState(() =>
    matriz.ucs.map((uc) => uc.indicadores.map(() => 3)) // 3 = "Não Avaliado"
  );

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState({});
  const [modalContext, setModalContext] = useState(null); // guarda uc e indicador

  const handleClick = (ucIndex, indIndex) => {
    setEstadoMatriz((prev) => {
      const novaMatriz = [...prev];
      novaMatriz[ucIndex] = [...novaMatriz[ucIndex]];
      novaMatriz[ucIndex][indIndex] =
        (novaMatriz[ucIndex][indIndex] + 1) % estados.length;
      return novaMatriz;
    });
  };

  const handleAbrirModal = (ucId, indicadorId) => {
    setModalContext({ ucId, indicadorId });
    setShowModal(true);
  };

  const handleConfirmarAtividade = () => {
    if (onSelecionarAtividade && modalContext) {
      const selecionadas = Object.entries(atividadeSelecionada)
        .filter(([_, checked]) => checked)
        .map(([id]) => id);

      onSelecionarAtividade({
        estudanteId,
        turmaId,
        avaliacaoId,
        ucId: modalContext.ucId,
        indicadorId: modalContext.indicadorId,
        atividades: selecionadas,
      });
    }
    setShowModal(false);
    setAtividadeSelecionada({});
    setModalContext(null);
  };

  const maxIndicadores = Math.max(
    ...matriz.ucs.map((uc) => uc.indicadores.length)
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
                                onSalvar?.({
                                  estudanteId,
                                  turmaId,
                                  avaliacaoId,
                                  ucId: uc.id_uc,
                                  indicadorId: indicador.id_indicador,
                                  estado,
                                })
                              }
                              title="Salvar"
                            />
                            <MdAssignment
                              style={{ cursor: "pointer", color: "gray" }}
                              onClick={() =>
                                handleAbrirModal(uc.id_uc, indicador.id_indicador)
                              }
                              title="Selecionar Atividade"
                            />
                            <MdComment
                              style={{ cursor: "pointer", color: "#198754" }}
                              onClick={() =>
                                onObservacao?.({
                                  estudanteId,
                                  turmaId,
                                  avaliacaoId,
                                  ucId: uc.id_uc,
                                  indicadorId: indicador.id_indicador,
                                })
                              }
                              title="Inserir Observação"
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

      {/* Botão global para salvar todos */}
      <div className="d-flex justify-content-end mt-3">
        <Button
          variant="primary"
          onClick={() =>
            onSalvarTodos?.({ estudanteId, turmaId, avaliacaoId, estadoMatriz })
          }
        >
          <FaSave className="me-2" />
          Salvar Todos
        </Button>
      </div>
      <div>
        <p>ID do curso: {idCurso} </p>
        <p>ID da turma: {idTurma} </p>
        <p>ID Estutante: {idEstudante}</p>
      </div>

      {/* Modal Seleção de Atividades */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Selecionar Atividade Avaliativa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {atividades.length > 0 ? (
            <Form>
              {atividades.map((atv) => (
                <Form.Check
                  key={atv.id}
                  type="checkbox"
                  label={atv.nome}
                  checked={atividadeSelecionada[atv.id] || false}
                  onChange={(e) =>
                    setAtividadeSelecionada((prev) => ({
                      ...prev,
                      [atv.id]: e.target.checked,
                    }))
                  }
                />
              ))}
            </Form>
          ) : (
            <p>Nenhuma atividade disponível.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmarAtividade}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvaliacaoEstudante;
