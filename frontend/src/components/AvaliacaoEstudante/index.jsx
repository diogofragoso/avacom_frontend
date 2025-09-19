import React, { useState } from "react";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { MdAssignment, MdComment } from "react-icons/md";
import avaliacaoService from "../../services/avaliacaoService";

const estados = [
  { label: "Atendido", text: "A", variant: "success" },
  { label: "Não Atendido", text: "NA", variant: "danger" },
  { label: "Parcialmente", text: "PA", variant: "warning" },
  { label: "Não Avaliado", text: "", variant: "secondary" },
];

// Função para converter a mencao em índice
const mencaoParaIndice = (mencao) => {
  const idx = estados.findIndex((e) => e.text === (mencao || ""));
  return idx >= 0 ? idx : 3; // 3 = Não Avaliado
};

const AvaliacaoEstudante = ({
  matriz,
  idEstudante,
  idTurma,
  turmaId,
  avaliacaoId,
  onSelecionarAtividade,
  onObservacao,
}) => {
  if (!matriz || !matriz.ucs) return <div>Carregando dados de avaliação...</div>;

  // Inicializa o estadoMatriz com as mencoes já salvas no backend
  const [estadoMatriz, setEstadoMatriz] = useState(() =>
    matriz.ucs.map((uc) =>
      uc.indicadores.map((ind) => mencaoParaIndice(ind.mencao))
    )
  );

  const [showAtividadeModal, setShowAtividadeModal] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState({});
  const [modalContext, setModalContext] = useState(null);
  const [atividadesModal, setAtividadesModal] = useState([]);

  const [showObsModal, setShowObsModal] = useState(false);
  const [observacao, setObservacao] = useState("");
  const [obsContext, setObsContext] = useState(null);

  const handleClick = (ucIndex, indIndex) => {
    setEstadoMatriz((prev) => {
      const novaMatriz = [...prev];
      novaMatriz[ucIndex] = [...novaMatriz[ucIndex]];
      novaMatriz[ucIndex][indIndex] =
        (novaMatriz[ucIndex][indIndex] + 1) % estados.length;
      return novaMatriz;
    });
  };

  const handleAbrirModalAtividade = (ucId, indicadorId) => {
    setModalContext({ ucId, indicadorId });
    const uc = matriz.ucs.find((u) => u.id_uc === ucId);
    const indicador = uc?.indicadores.find((ind) => ind.id_indicador === indicadorId);
    const avaliativas = indicador?.avaliativas || [];
    const lista = avaliativas.map((a) => ({ id: a.id_avaliativa, nome: a.descricao_avaliativa }));
    setAtividadesModal(lista);
    setAtividadeSelecionada({});
    setShowAtividadeModal(true);
  };

  const handleConfirmarAtividade = () => {
    if (onSelecionarAtividade && modalContext) {
      const selecionadas = Object.entries(atividadeSelecionada)
        .filter(([_, checked]) => checked)
        .map(([id]) => id);

      onSelecionarAtividade({
        estudanteId: idEstudante,
        turmaId,
        avaliacaoId,
        ucId: modalContext.ucId,
        indicadorId: modalContext.indicadorId,
        atividades: selecionadas,
      });
    }
    setShowAtividadeModal(false);
    setAtividadeSelecionada({});
    setModalContext(null);
  };

  const handleAbrirObsModal = (ucId, indicadorId) => {
    setObsContext({ ucId, indicadorId });
    setObservacao("");
    setShowObsModal(true);
  };

  const handleConfirmarObservacao = async () => {
    if (onObservacao && obsContext) {
      if (!avaliacaoId) {
        alert("Avaliação não encontrada para salvar observação!");
        return;
      }
      await onObservacao({
        estudanteId: idEstudante,
        turmaId,
        avaliacaoId,
        ucId: obsContext.ucId,
        indicadorId: obsContext.indicadorId,
        observacao,
      });
    }
    setShowObsModal(false);
    setObservacao("");
    setObsContext(null);
  };

  const maxIndicadores = Math.max(...matriz.ucs.map((uc) => uc.indicadores.length));

  const handleAtualizarBadge = async (uc, indicador, estado) => {
    try {
      await avaliacaoService.atualizar(avaliacaoId, { mencao: estado.text });
      alert("Avaliação atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar avaliação:", err);
      alert("Erro ao atualizar avaliação");
    }
  };

  const handleAtualizarTodos = async () => {
    try {
      for (let ucIndex = 0; ucIndex < matriz.ucs.length; ucIndex++) {
        const uc = matriz.ucs[ucIndex];
        for (let indIndex = 0; indIndex < uc.indicadores.length; indIndex++) {
          const indicador = uc.indicadores[indIndex];
          const estadoIndex = estadoMatriz[ucIndex][indIndex];
          const estado = estados[estadoIndex];
          await handleAtualizarBadge(uc, indicador, estado);
        }
      }
      alert("Todas as avaliações foram atualizadas com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar todas avaliações:", err);
      alert("Erro ao atualizar todas avaliações");
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex gap-3 mb-3">
        {estados.map((estado, idx) => (
          <div key={idx} className="d-flex align-items-center gap-2">
            <Badge bg={estado.variant}>{estado.text || " "}</Badge>
            <span>{estado.label}</span>
          </div>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <Table bordered responsive>
          <thead>
            <tr>
              <th style={{ backgroundColor: "#0d6efd", color: "white" }}>UC</th>
              {Array.from({ length: maxIndicadores }, (_, i) => (
                <th key={i} style={{ backgroundColor: "#0d6efd", color: "white" }}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matriz.ucs.map((uc, ucIndex) => (
              <tr key={uc.id_uc}>
                <td style={{ backgroundColor: "#0d6efd", color: "white", fontWeight: "bold" }}>
                  UC{uc.numero_uc}
                </td>
                {Array.from({ length: maxIndicadores }, (_, indIndex) => {
                  const indicador = uc.indicadores[indIndex];
                  const estadoIndex = estadoMatriz[ucIndex]?.[indIndex];
                  const estado = estados[estadoIndex];

                  return (
                    <td key={indIndex}>
                      {indicador && (
                        <div className="d-flex" style={{ height: "100%", alignItems: "center" }}>
                          <div
                            className="flex-grow-1 d-flex justify-content-center align-items-center"
                            onClick={() => handleClick(ucIndex, indIndex)}
                            style={{ cursor: "pointer" }}
                          >
                            <Badge bg={estado.variant}>{estado.text || " "}</Badge>
                          </div>

                          <div
                            style={{
                              width: "1px",
                              backgroundColor: "#dee2e6",
                              margin: "0 6px",
                              alignSelf: "stretch",
                            }}
                          />

                          <div className="d-flex gap-2 justify-content-end align-items-center">
                            <FaSave
                              style={{ cursor: "pointer", color: "#0d6efd" }}
                              onClick={() => handleAtualizarBadge(uc, indicador, estado)}
                              title="Atualizar Estado"
                            />
                            <MdAssignment
                              style={{ cursor: "pointer", color: "gray" }}
                              onClick={() => handleAbrirModalAtividade(uc.id_uc, indicador.id_indicador)}
                              title="Selecionar Atividade"
                            />
                            <MdComment
                              style={{ cursor: "pointer", color: "#198754" }}
                              onClick={() => handleAbrirObsModal(uc.id_uc, indicador.id_indicador)}
                              title="Inserir Observação"
                            />
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-end mt-3">
        <Button variant="primary" onClick={handleAtualizarTodos}>
          <FaSave className="me-2" /> Atualizar Todos
        </Button>
      </div>

      {/* Modal Atividade */}
      <Modal show={showAtividadeModal} onHide={() => setShowAtividadeModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Selecionar Atividade Avaliativa</Modal.Title></Modal.Header>
        <Modal.Body>
          {atividadesModal.length > 0 ? (
            <Form>
              {atividadesModal.map((atv) => (
                <Form.Check
                  key={atv.id}
                  type="checkbox"
                  label={atv.nome}
                  checked={atividadeSelecionada[atv.id] || false}
                  onChange={(e) =>
                    setAtividadeSelecionada((prev) => ({ ...prev, [atv.id]: e.target.checked }))
                  }
                />
              ))}
            </Form>
          ) : <p>Nenhuma atividade disponível.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAtividadeModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirmarAtividade}>Confirmar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Observação */}
      <Modal show={showObsModal} onHide={() => setShowObsModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Inserir Observação</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Observação</Form.Label>
            <Form.Control as="textarea" rows={4} value={observacao} onChange={(e) => setObservacao(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowObsModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={handleConfirmarObservacao}>Salvar Observação</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvaliacaoEstudante;
