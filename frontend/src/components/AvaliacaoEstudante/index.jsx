import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Modal, Form, Alert, Spinner } from "react-bootstrap";
import { FaSave, FaClipboardList, FaMagic } from "react-icons/fa"; // Adicionado FaMagic
import { MdOutlineFeedback, MdComment } from "react-icons/md";
import avaliacaoService from "../../services/avaliacaoService";
import { gerarSugestaoFeedback } from "../../services/geminiService"; // Importação do serviço IA

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

const AvaliacaoEstudante = ({ matriz, idEstudante, idTurma, onSelecionarAtividade }) => {
  if (!matriz || !matriz.ucs) return <div>Carregando dados de avaliação...</div>;

  // Estados originais
  const [estadoMatriz, setEstadoMatriz] = useState(() => matriz.ucs.map(uc => uc.indicadores.map(() => 3)));
  const [idAvaliacaoMatriz, setIdAvaliacaoMatriz] = useState(() => matriz.ucs.map(uc => uc.indicadores.map(() => null)));
  const [observacaoMatriz, setObservacaoMatriz] = useState(() => matriz.ucs.map(uc => uc.indicadores.map(() => "")));
  const [acaoRecuperacaoMatriz, setAcaoRecuperacaoMatriz] = useState(() => matriz.ucs.map(uc => uc.indicadores.map(() => "")));
  const [avaliacaoFinalPorUC, setAvaliacaoFinalPorUC] = useState(() => matriz.ucs.map(() => 3));
  const [feedbackPorUC, setFeedbackPorUC] = useState(() => matriz.ucs.map(() => ""));

  // Modais e contextos
  const [showObsModal, setShowObsModal] = useState(false);
  const [observacaoAtual, setObservacaoAtual] = useState("");
  const [obsContext, setObsContext] = useState(null);

  const [showAcaoModal, setShowAcaoModal] = useState(false);
  const [acaoAtual, setAcaoAtual] = useState("");
  const [acaoContext, setAcaoContext] = useState(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackAtual, setFeedbackAtual] = useState("");
  const [feedbackContext, setFeedbackContext] = useState(null);
  
  // Novo estado para controle de carregamento da IA
  const [isLoadingIA, setIsLoadingIA] = useState(false);

  const [alertInfo, setAlertInfo] = useState({ show: false, variant: "success", message: "" });

  // 1. useEffect focado em carregar DADOS DOS INDICADORES
  useEffect(() => {
    const carregarAvaliacoesIndicadores = async () => {
      const novaMatrizEstado = matriz.ucs.map(uc => uc.indicadores.map(() => 3));
      const novaMatrizId = matriz.ucs.map(uc => uc.indicadores.map(() => null));
      const novaObservacao = matriz.ucs.map(uc => uc.indicadores.map(() => ""));
      const novaAcao = matriz.ucs.map(uc => uc.indicadores.map(() => ""));

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
                novaMatrizId[ucIndex][indIndex] = avaliacaoDoAluno.id_avaliacao;
                novaObservacao[ucIndex][indIndex] = avaliacaoDoAluno.observacao || "";
                novaAcao[ucIndex][indIndex] = avaliacaoDoAluno.acao_recuperacao || "";
              }
            } catch (err) { console.error(err); }
          }
        }
      }
      setEstadoMatriz(novaMatrizEstado);
      setIdAvaliacaoMatriz(novaMatrizId);
      setObservacaoMatriz(novaObservacao);
      setAcaoRecuperacaoMatriz(novaAcao);
    };

    if (idEstudante) carregarAvaliacoesIndicadores();
  }, [matriz, idEstudante]);

  // 2. useEffect focado em carregar DADOS DA AVALIAÇÃO FINAL
  useEffect(() => {
    const carregarAvaliacoesFinais = async () => {
      try {
        const avaliacoesFinaisSalvas = await avaliacaoService.getAvaliacoesFinais(idEstudante, idTurma);
        
        const novaMenFinal = matriz.ucs.map(() => 3);
        const novaFeedback = matriz.ucs.map(() => "");

        avaliacoesFinaisSalvas.forEach(av => {
          const ucIndex = matriz.ucs.findIndex(uc => uc.id_uc === av.id_uc_fk);
          if (ucIndex !== -1) {
            if (av.mencao_final !== null && av.mencao_final !== undefined) {
              novaMenFinal[ucIndex] = mencaoParaIndice(av.mencao_final);
            }
            if (av.feedback_final) {
              novaFeedback[ucIndex] = av.feedback_final;
            }
          }
        });

        setAvaliacaoFinalPorUC(novaMenFinal);
        setFeedbackPorUC(novaFeedback);
      } catch (error) {
        console.error("Erro ao carregar avaliações finais:", error);
      }
    };

    if (idEstudante && idTurma) carregarAvaliacoesFinais();
  }, [matriz.ucs, idEstudante, idTurma]);

  // useEffect para o alerta
  useEffect(() => {
    if (alertInfo.show) {
      const timer = setTimeout(() => setAlertInfo({ ...alertInfo, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [alertInfo]);

  // --- NOVA FUNÇÃO: Integração com Gemini ---
  const handleMelhorarComIA = async () => {
    if (!feedbackAtual || feedbackAtual.trim().length < 5) {
      setAlertInfo({ 
        show: true, 
        variant: "warning", 
        message: "Digite um rascunho de pelo menos 5 caracteres para a IA melhorar." 
      });
      return;
    }

    setIsLoadingIA(true);
    try {
      const textoMelhorado = await gerarSugestaoFeedback(feedbackAtual);
      setFeedbackAtual(textoMelhorado);
      setAlertInfo({ show: true, variant: "success", message: "Sugestão gerada com sucesso!" });
    } catch (error) {
      setAlertInfo({ 
        show: true, 
        variant: "danger", 
        message: "Erro ao conectar com a IA. Verifique sua conexão ou a chave API." 
      });
    } finally {
      setIsLoadingIA(false);
    }
  };
  // ------------------------------------------

  const handleClick = (ucIndex, indIndex) => {
    setEstadoMatriz(prev => {
      const nova = prev.map(r => [...r]);
      nova[ucIndex][indIndex] = (nova[ucIndex][indIndex] + 1) % estados.length;
      return nova;
    });
  };

  const handleAtualizarBadge = async (ucIndex, indIndex) => {
    const idAvaliacao = idAvaliacaoMatriz[ucIndex]?.[indIndex];
    if (!idAvaliacao) return setAlertInfo({ show: true, variant: "warning", message: "Associe uma atividade primeiro." });
    const estado = estados[estadoMatriz[ucIndex][indIndex]];
    try {
      await avaliacaoService.atualizar(idAvaliacao, { mencao: estado.text });
      setAlertInfo({ show: true, variant: "success", message: "Menção atualizada!" });
    } catch { setAlertInfo({ show: true, variant: "danger", message: "Erro ao atualizar menção." }); }
  };

  const handleAbrirObsModal = (ucIndex, indIndex) => {
    const idAvaliacao = idAvaliacaoMatriz[ucIndex]?.[indIndex];
    if (!idAvaliacao) return setAlertInfo({ show: true, variant: "warning", message: "Associe uma atividade antes de adicionar observação." });
    setObsContext({ ucIndex, indIndex, idAvaliacao });
    setObservacaoAtual(observacaoMatriz[ucIndex][indIndex]);
    setShowObsModal(true);
  };

  const handleSalvarObservacao = async () => {
    if (!obsContext) return;
    const { ucIndex, indIndex, idAvaliacao } = obsContext;
    try {
      await avaliacaoService.atualizar(idAvaliacao, { observacao_avaliacao: observacaoAtual });
      const nova = observacaoMatriz.map(r => [...r]);
      nova[ucIndex][indIndex] = observacaoAtual;
      setObservacaoMatriz(nova);
      setShowObsModal(false);
      setAlertInfo({ show: true, variant: "success", message: "Observação salva!" });
    } catch { setAlertInfo({ show: true, variant: "danger", message: "Erro ao salvar observação." }); }
  };

  const handleAbrirAcaoModal = (ucIndex, indIndex) => {
    const idAvaliacao = idAvaliacaoMatriz[ucIndex]?.[indIndex];
    if (!idAvaliacao) return setAlertInfo({ show: true, variant: "warning", message: "Salve uma menção antes de adicionar uma ação." });
    setAcaoContext({ ucIndex, indIndex, idAvaliacao });
    setAcaoAtual(acaoRecuperacaoMatriz[ucIndex][indIndex]);
    setShowAcaoModal(true);
  };

  const handleSalvarAcaoRecuperacao = async () => {
    if (!acaoContext) return;
    const { ucIndex, indIndex, idAvaliacao } = acaoContext;
    try {
      await avaliacaoService.atualizar(idAvaliacao, { acao_recuperacao: acaoAtual });
      const nova = acaoRecuperacaoMatriz.map(r => [...r]);
      nova[ucIndex][indIndex] = acaoAtual;
      setAcaoRecuperacaoMatriz(nova);
      setShowAcaoModal(false);
      setAlertInfo({ show: true, variant: "success", message: "Ação de recuperação salva!" });
    } catch { setAlertInfo({ show: true, variant: "danger", message: "Erro ao salvar ação de recuperação." }); }
  };

  const handleAbrirFeedbackModal = (ucIndex) => {
    setFeedbackContext({ ucIndex });
    setFeedbackAtual(feedbackPorUC[ucIndex]);
    setShowFeedbackModal(true);
  };

  const handleSalvarFeedback = async () => {
    if (!feedbackContext) return;
    const { ucIndex } = feedbackContext;
    const uc = matriz.ucs[ucIndex];
    try {
      await avaliacaoService.salvarAvaliacaoFinal({
        id_aluno_fk: idEstudante,
        id_turma_fk: idTurma,
        id_uc_fk: uc.id_uc,
        feedback_final: feedbackAtual,
      });
      const nova = [...feedbackPorUC];
      nova[ucIndex] = feedbackAtual;
      setFeedbackPorUC(nova);
      setShowFeedbackModal(false);
      setAlertInfo({ show: true, variant: "success", message: "Feedback salvo com sucesso!" });
    } catch { 
      setAlertInfo({ show: true, variant: "danger", message: "Erro ao salvar feedback." }); 
    }
  };

  const handleClickMenFinal = (ucIndex) => {
    setAvaliacaoFinalPorUC(prev => {
      const nova = [...prev];
      nova[ucIndex] = (nova[ucIndex] + 1) % estados.length;
      return nova;
    });
  };

  const handleSalvarMenFinal = async (ucIndex) => {
    const estado = estados[avaliacaoFinalPorUC[ucIndex]];
    const uc = matriz.ucs[ucIndex];
    try {
      await avaliacaoService.salvarAvaliacaoFinal({
        id_aluno_fk: idEstudante,
        id_turma_fk: idTurma,
        id_uc_fk: uc.id_uc,
        mencao_final: estado.text,
      });
      setAlertInfo({ show: true, variant: "success", message: "Menção final salva com sucesso!" });
    } catch { 
      setAlertInfo({ show: true, variant: "danger", message: "Erro ao salvar menção final." }); 
    }
  };

  const maxIndicadores = Math.max(0, ...matriz.ucs.map(uc => uc.indicadores.length));

  return (
    <div className="p-3">
      {alertInfo.show && (
        <Alert variant={alertInfo.variant} dismissible onClose={() => setAlertInfo({ ...alertInfo, show: false })} style={{ position: "fixed", top: 20, right: 20, zIndex: 1050, minWidth: 300 }}>
          {alertInfo.message}
        </Alert>
      )}

      <div className="d-flex gap-3 mb-3">
        {estados.map((estado, idx) => (
          <div key={idx} className="d-flex align-items-center gap-2">
            <Badge bg={estado.variant}>{estado.text || " "}</Badge>
            <span>{estado.label}</span>
          </div>
        ))}
      </div>

      <div style={{ overflowX: "auto" }}>
        <Table bordered responsive hover className="align-middle text-center">
          <thead>
            <tr>
              <th style={{ backgroundColor: "#0d6efd", color: "white" }}>UC</th>
              {Array.from({ length: maxIndicadores }, (_, i) => (
                <th key={i} style={{ backgroundColor: "#0d6efd", color: "white" }}>{i + 1}</th>
              ))}
              <th style={{ backgroundColor: "#0d6efd", color: "white" }}>Feedback</th>
              <th style={{ backgroundColor: "#0d6efd", color: "white" }}>Menção Final</th>
            </tr>
          </thead>
          <tbody>
            {matriz.ucs.map((uc, ucIndex) => (
              <tr key={uc.id_uc}>
                <td style={{ backgroundColor: "#0d6efd", color: "white", fontWeight: "bold" }}>UC{uc.numero_uc}</td>
                {Array.from({ length: maxIndicadores }, (_, indIndex) => {
                  const indicador = uc.indicadores[indIndex];
                  if (!indicador) return <td key={indIndex}></td>;
                  const estadoIndex = estadoMatriz[ucIndex][indIndex];
                  const estado = estados[estadoIndex];
                  const corObs = observacaoMatriz[ucIndex][indIndex] ? "#198754" : "gray";
                  const corAcao = acaoRecuperacaoMatriz[ucIndex][indIndex] ? "#198754" : "gray";

                  return (
                    <td key={indIndex}>
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <Badge bg={estado.variant} style={{ cursor: "pointer", minWidth: 32 }} onClick={() => handleClick(ucIndex, indIndex)}>{estado.text || " "}</Badge>
                        <FaSave style={{ cursor: "pointer", color: "#0d6efd" }} onClick={() => handleAtualizarBadge(ucIndex, indIndex)} />
                        <FaClipboardList style={{ cursor: "pointer", color: corAcao }} onClick={() => handleAbrirAcaoModal(ucIndex, indIndex)} />
                        <MdComment style={{ cursor: "pointer", color: corObs }} onClick={() => handleAbrirObsModal(ucIndex, indIndex)} />
                      </div>
                    </td>
                  );
                })}
                <td>
                  <div className="d-flex justify-content-center">
                    <MdOutlineFeedback
                      style={{
                        cursor: "pointer",
                        color: feedbackPorUC[ucIndex] ? "#198754" : "gray",
                        fontSize: "1.25rem"
                      }}
                      onClick={() => handleAbrirFeedbackModal(ucIndex)}
                      title="Registrar Feedback"
                    />
                  </div>
                </td>
                <td>
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <Badge
                      bg={estados[avaliacaoFinalPorUC[ucIndex]]?.variant}
                      style={{ cursor: "pointer", minWidth: 32 }}
                      onClick={() => handleClickMenFinal(ucIndex)}
                    >
                      {estados[avaliacaoFinalPorUC[ucIndex]]?.text || " "}
                    </Badge>
                    <FaSave
                      style={{ cursor: "pointer", color: "#0d6efd" }}
                      onClick={() => handleSalvarMenFinal(ucIndex)}
                      title="Salvar Menção Final"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showObsModal} onHide={() => setShowObsModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Adicionar / Editar Observação</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Control as="textarea" rows={4} value={observacaoAtual} onChange={e => setObservacaoAtual(e.target.value)} placeholder="Digite sua observação aqui..." />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowObsModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvarObservacao}>Salvar Observação</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAcaoModal} onHide={() => setShowAcaoModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Adicionar / Editar Ação de Recuperação</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Control as="textarea" rows={4} value={acaoAtual} onChange={e => setAcaoAtual(e.target.value)} placeholder="Descreva a ação de recuperação..." />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAcaoModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvarAcaoRecuperacao}>Salvar Ação</Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL DE FEEDBACK ATUALIZADO COM IA */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Adicionar / Editar Feedback</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label className="fw-bold text-secondary" style={{fontSize: "0.9rem"}}>
              Escreva seu feedback ou rascunho abaixo:
            </Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              value={feedbackAtual} 
              onChange={e => setFeedbackAtual(e.target.value)} 
              placeholder="Ex: O aluno foi bem, mas precisa melhorar na entrega dos prazos..." 
            />
            <div className="d-flex justify-content-end mt-2">
               <Button 
                 variant="outline-primary" 
                 size="sm" 
                 onClick={handleMelhorarComIA}
                 disabled={isLoadingIA}
                 title="Melhorar redação com Inteligência Artificial"
                 className="d-flex align-items-center gap-2"
               >
                 {isLoadingIA ? (
                   <><Spinner animation="border" size="sm" /> Gerando...</>
                 ) : (
                   <><FaMagic /> Melhorar com IA</>
                 )}
               </Button>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvarFeedback}>Salvar Feedback</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvaliacaoEstudante;