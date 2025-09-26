// Caminho: src/components/AvaliacaoEstudante.jsx
import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Modal, Form, Alert } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { MdAssignment, MdComment } from "react-icons/md";
import avaliacaoService from "../../services/avaliacaoService";

const estados = [
  { label: "Atendido", text: "A", variant: "success" },
  { label: "Não Atendido", text: "NA", variant: "danger" },
  { label: "Parcialmente", text: "PA", variant: "warning" },
  { label: "Não Avaliado", text: "", variant: "secondary" },
];

const mencaoParaIndice = (mencao) => {
  const idx = estados.findIndex((e) => e.text === (mencao || ""));
  return idx >= 0 ? idx : 3;
};

const AvaliacaoEstudante = ({
  matriz,
  idEstudante,
  idTurma,
  onSelecionarAtividade,
}) => {
  if (!matriz || !matriz.ucs) {
    return <div>Carregando dados de avaliação...</div>;
  }

  const [estadoMatriz, setEstadoMatriz] = useState(() =>
    matriz.ucs.map((uc) => uc.indicadores.map(() => 3))
  );

  const [idAvaliacaoMatriz, setIdAvaliacaoMatriz] = useState(() =>
    matriz.ucs.map((uc) => uc.indicadores.map(() => null))
  );

  const [observacaoMatriz, setObservacaoMatriz] = useState(() =>
    matriz.ucs.map((uc) => uc.indicadores.map(() => ''))
  );

  const [showAtividadeModal, setShowAtividadeModal] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState({});
  const [modalContext, setModalContext] = useState(null);
  const [atividadesModal, setAtividadesModal] = useState([]);
  
  const [showObsModal, setShowObsModal] = useState(false);
  const [observacaoAtual, setObservacaoAtual] = useState("");
  const [obsContext, setObsContext] = useState(null);

  const [alertInfo, setAlertInfo] = useState({ show: false, variant: 'success', message: '' });

  useEffect(() => {
    const carregarAvaliacoesSalvas = async () => {
      const novaMatrizEstado = matriz.ucs.map(uc => uc.indicadores.map(() => 3));
      const novaMatrizIdAvaliacao = matriz.ucs.map(uc => uc.indicadores.map(() => null));
      const novaMatrizObservacao = matriz.ucs.map(uc => uc.indicadores.map(() => ''));

      for (let ucIndex = 0; ucIndex < matriz.ucs.length; ucIndex++) {
        const uc = matriz.ucs[ucIndex];
        for (let indIndex = 0; indIndex < uc.indicadores.length; indIndex++) {
          const indicador = uc.indicadores[indIndex];
          if (indicador) {
            try {
              const resp = await avaliacaoService.getSelecionadas(indicador.id_indicador);
              const avaliacaoDoAluno = resp.avaliativas.find(av => av.id_aluno === idEstudante);

              if (avaliacaoDoAluno) {
                novaMatrizEstado[ucIndex][indIndex] = mencaoParaIndice(avaliacaoDoAluno.mencao);
                novaMatrizIdAvaliacao[ucIndex][indIndex] = avaliacaoDoAluno.id_avaliacao;
                // **** AJUSTE 1 ****: A API retorna 'observacao', mas o nome da coluna é 'observacao_avaliacao'
                // Se sua API de listagem (`getSelecionadas`) retorna `observacao`, mantenha. 
                // Se retorna `observacao_avaliacao`, troque aqui. Supondo que retorna `observacao_avaliacao`.
                novaMatrizObservacao[ucIndex][indIndex] = avaliacaoDoAluno.observacao_avaliacao || '';
              }
            } catch (error) {
              console.error(`Erro ao buscar dados para o indicador ${indicador.id_indicador}:`, error);
            }
          }
        }
      }
      setEstadoMatriz(novaMatrizEstado);
      setIdAvaliacaoMatriz(novaMatrizIdAvaliacao);
      setObservacaoMatriz(novaMatrizObservacao);
    };

    if (idEstudante) {
      carregarAvaliacoesSalvas();
    }
  }, [matriz, idEstudante]);

  useEffect(() => {
    if (alertInfo.show) {
      const timer = setTimeout(() => setAlertInfo({ ...alertInfo, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  const handleClick = (ucIndex, indIndex) => {
    setEstadoMatriz((prev) => {
      const novaMatriz = prev.map(row => [...row]);
      novaMatriz[ucIndex][indIndex] = (novaMatriz[ucIndex][indIndex] + 1) % estados.length;
      return novaMatriz;
    });
  };
  
  const handleAtualizarBadge = async (ucIndex, indIndex) => {
    const idAvaliacao = idAvaliacaoMatriz[ucIndex]?.[indIndex];
    if (!idAvaliacao) {
      setAlertInfo({ show: true, variant: 'warning', message: 'Associe uma atividade avaliativa primeiro.' });
      return;
    }
    
    const estadoIndex = estadoMatriz[ucIndex][indIndex];
    const estado = estados[estadoIndex];

    try {
      await avaliacaoService.atualizar(idAvaliacao, { mencao: estado.text });
      setAlertInfo({ show: true, variant: 'success', message: 'Menção atualizada com sucesso!' });
    } catch (err) {
      console.error("Erro ao atualizar a avaliação:", err);
      setAlertInfo({ show: true, variant: 'danger', message: 'Falha ao atualizar a menção.' });
    }
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

  const handleConfirmarAtividade = () => { /* ... sem alterações ... */ };

  const handleAbrirObsModal = (ucIndex, indIndex) => {
    const idAvaliacao = idAvaliacaoMatriz[ucIndex]?.[indIndex];
    if (!idAvaliacao) {
      setAlertInfo({ show: true, variant: 'warning', message: 'Associe uma atividade antes de adicionar uma observação.' });
      return;
    }
    setObsContext({ ucIndex, indIndex, idAvaliacao });
    setObservacaoAtual(observacaoMatriz[ucIndex][indIndex]);
    setShowObsModal(true);
  };

  const handleSalvarObservacao = async () => {
    if (!obsContext) return;
    const { ucIndex, indIndex, idAvaliacao } = obsContext;

    try {
      // **** AJUSTE 2 ****: Enviar o nome do campo que a API espera: 'observacao_avaliacao'
      await avaliacaoService.atualizar(idAvaliacao, { observacao_avaliacao: observacaoAtual });
      
      const novaObservacaoMatriz = observacaoMatriz.map(row => [...row]);
      novaObservacaoMatriz[ucIndex][indIndex] = observacaoAtual;
      setObservacaoMatriz(novaObservacaoMatriz);

      setShowObsModal(false);
      setAlertInfo({ show: true, variant: 'success', message: 'Observação salva com sucesso!' });
    } catch (err) {
      console.error("Erro ao salvar observação:", err);
      setAlertInfo({ show: true, variant: 'danger', message: 'Falha ao salvar a observação.' });
    }
  };

  const maxIndicadores = Math.max(0, ...matriz.ucs.map((uc) => uc.indicadores.length));

  return (
    <div className="p-3">
      {/* Alerta Flutuante */}
      {alertInfo.show && (
        <Alert
          variant={alertInfo.variant}
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
          dismissible
          style={{
            position: 'fixed', top: '20px', right: '20px', zIndex: 1050, minWidth: '300px',
          }}
        >
          {alertInfo.message}
        </Alert>
      )}

      {/* Legenda */}
      <div className="d-flex gap-3 mb-3">
        {estados.map((estado, idx) => (
          <div key={idx} className="d-flex align-items-center gap-2">
            <Badge bg={estado.variant}>{estado.text || " "}</Badge>
            <span>{estado.label}</span>
          </div>
        ))}
      </div>

      {/* Tabela Principal */}
      <div style={{ overflowX: "auto" }}>
        <Table bordered responsive>
          {/* ... Head da tabela sem alterações ... */}
          <thead>
            <tr>
              <th style={{ backgroundColor: "#0d6efd", color: "white" }}>UC</th>
              {Array.from({ length: maxIndicadores }, (_, i) => (
                <th key={i} style={{ backgroundColor: "#0d6efd", color: "white" }}>
                  {i + 1}
                </th>
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
                      {indicador ? (
                        <div className="d-flex" style={{ height: "100%", alignItems: "center" }}>
                          <div
                            className="flex-grow-1 d-flex justify-content-center align-items-center"
                            onClick={() => handleClick(ucIndex, indIndex)}
                            style={{ cursor: "pointer" }}
                          >
                            <Badge bg={estado?.variant}>{estado?.text || " "}</Badge>
                          </div>
                          <div style={{ width: "1px", backgroundColor: "#dee2e6", margin: "0 6px", alignSelf: "stretch" }}></div>
                          <div className="d-flex gap-2 justify-content-end align-items-center">
                            <FaSave
                              style={{ cursor: "pointer", color: "#0d6efd" }}
                              onClick={() => handleAtualizarBadge(ucIndex, indIndex)}
                              title="Salvar Menção"
                            />
                            <MdAssignment
                              style={{ cursor: "pointer", color: "gray" }}
                              onClick={() => handleAbrirModalAtividade(uc.id_uc, indicador.id_indicador)}
                              title="Selecionar Atividade"
                            />
                            <MdComment
                              style={{ cursor: "pointer", color: "#198754" }}
                              onClick={() => handleAbrirObsModal(ucIndex, indIndex)}
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

      {/* Modal de Seleção de Atividades */}
      {/* ... Sem alterações ... */}
      <Modal show={showAtividadeModal} onHide={() => setShowAtividadeModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Selecionar Atividade Avaliativa</Modal.Title>
        </Modal.Header>
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
          <Button variant="secondary" onClick={() => setShowAtividadeModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmarAtividade}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Observação */}
      {/* ... Sem alterações ... */}
      <Modal show={showObsModal} onHide={() => setShowObsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar / Editar Observação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Observação sobre o desempenho do aluno neste indicador:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={observacaoAtual}
              onChange={(e) => setObservacaoAtual(e.target.value)}
              placeholder="Digite sua observação aqui..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowObsModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSalvarObservacao}>
            Salvar Observação
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvaliacaoEstudante;