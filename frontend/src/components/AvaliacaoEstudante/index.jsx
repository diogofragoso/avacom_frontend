import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Modal, Form, Alert } from "react-bootstrap";
// ALTERAÇÃO 1: Trocamos o ícone FaTools por um mais sugestivo, FaClipboardList
import { FaSave, FaClipboardList } from "react-icons/fa";
import { MdComment } from "react-icons/md";
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

  // Seus estados funcionais foram MANTIDOS
  const [estadoMatriz, setEstadoMatriz] = useState(() =>
    matriz.ucs.map((uc) => uc.indicadores.map(() => 3))
  );
  const [idAvaliacaoMatriz, setIdAvaliacaoMatriz] = useState(() =>
    matriz.ucs.map((uc) => uc.indicadores.map(() => null))
  );
  const [observacaoMatriz, setObservacaoMatriz] = useState(() =>
    matriz.ucs.map((uc) => uc.indicadores.map(() => ''))
  );
  const [showObsModal, setShowObsModal] = useState(false);
  const [observacaoAtual, setObservacaoAtual] = useState("");
  const [obsContext, setObsContext] = useState(null);
  const [acaoRecuperacaoMatriz, setAcaoRecuperacaoMatriz] = useState(() =>
    matriz.ucs.map((uc) => uc.indicadores.map(() => ''))
  );
  const [showAcaoModal, setShowAcaoModal] = useState(false);
  const [acaoAtual, setAcaoAtual] = useState("");
  const [acaoContext, setAcaoContext] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, variant: 'success', message: '' });

  // Sua lógica de carregamento funcional está 100% MANTIDA
  useEffect(() => {
    const carregarAvaliacoesSalvas = async () => {
      const novaMatrizEstado = matriz.ucs.map(uc => uc.indicadores.map(() => 3));
      const novaMatrizIdAvaliacao = matriz.ucs.map(uc => uc.indicadores.map(() => null));
      const novaMatrizObservacao = matriz.ucs.map(uc => uc.indicadores.map(() => ''));
      const novaMatrizAcaoRecuperacao = matriz.ucs.map(uc => uc.indicadores.map(() => ''));

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
                novaMatrizObservacao[ucIndex][indIndex] = avaliacaoDoAluno.observacao || '';
                novaMatrizAcaoRecuperacao[ucIndex][indIndex] = avaliacaoDoAluno.acao_recuperacao || '';
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
      setAcaoRecuperacaoMatriz(novaMatrizAcaoRecuperacao);
    };

    if (idEstudante) {
      carregarAvaliacoesSalvas();
    }
  }, [matriz, idEstudante]);

  // TODAS as suas funções originais estão aqui, INTACTAS.
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

  const handleAbrirAcaoModal = (ucIndex, indIndex) => {
    const idAvaliacao = idAvaliacaoMatriz[ucIndex]?.[indIndex];
    if (!idAvaliacao) {
      setAlertInfo({ show: true, variant: 'warning', message: 'Salve uma menção antes de adicionar uma ação.' });
      return;
    }
    setAcaoContext({ ucIndex, indIndex, idAvaliacao });
    setAcaoAtual(acaoRecuperacaoMatriz[ucIndex][indIndex]);
    setShowAcaoModal(true);
  };

  const handleSalvarAcaoRecuperacao = async () => {
    if (!acaoContext) return;
    const { ucIndex, indIndex, idAvaliacao } = acaoContext;
    try {
      await avaliacaoService.atualizar(idAvaliacao, { acao_recuperacao: acaoAtual });
      const novaAcaoMatriz = acaoRecuperacaoMatriz.map(row => [...row]);
      novaAcaoMatriz[ucIndex][indIndex] = acaoAtual;
      setAcaoRecuperacaoMatriz(novaAcaoMatriz);
      setShowAcaoModal(false);
      setAlertInfo({ show: true, variant: 'success', message: 'Ação de recuperação salva com sucesso!' });
    } catch (err) {
      console.error("Erro ao salvar ação de recuperação:", err);
      setAlertInfo({ show: true, variant: 'danger', message: 'Falha ao salvar a ação de recuperação.' });
    }
  };

  const maxIndicadores = Math.max(0, ...matriz.ucs.map((uc) => uc.indicadores.length));

  return (
    <div className="p-3">
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

                  // ALTERAÇÃO 2: Lógica para definir a cor dos ícones dinamicamente
                  // Verifica se existe texto na matriz de dados para a célula atual. Se sim, cor verde, senão cinza.
                  const corIconeObservacao = observacaoMatriz[ucIndex]?.[indIndex] ? '#198754' : 'gray';
                  const corIconeAcao = acaoRecuperacaoMatriz[ucIndex]?.[indIndex] ? '#198754' : 'gray';

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
                            <FaSave style={{ cursor: "pointer", color: "#0d6efd" }} onClick={() => handleAtualizarBadge(ucIndex, indIndex)} title="Salvar Menção" />
                            
                            {/* ALTERAÇÃO 3: Ícone trocado e cor agora é dinâmica */}
                            <FaClipboardList style={{ cursor: "pointer", color: corIconeAcao }} onClick={() => handleAbrirAcaoModal(ucIndex, indIndex)} title="Inserir Ação de Recuperação" />
                            
                            {/* ALTERAÇÃO 4: Cor do ícone de comentário agora é dinâmica */}
                            <MdComment style={{ cursor: "pointer", color: corIconeObservacao }} onClick={() => handleAbrirObsModal(ucIndex, indIndex)} title="Inserir Observação" />
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
      {/* Seus modais, intactos */}
      <Modal show={showObsModal} onHide={() => setShowObsModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Adicionar / Editar Observação</Modal.Title></Modal.Header><Modal.Body><Form.Group><Form.Label>Observação sobre o desempenho do aluno neste indicador:</Form.Label><Form.Control as="textarea" rows={5} value={observacaoAtual} onChange={(e)=>setObservacaoAtual(e.target.value)} placeholder="Digite sua observação aqui..."/></Form.Group></Modal.Body><Modal.Footer><Button variant="secondary" onClick={()=>setShowObsModal(false)}>Cancelar</Button><Button variant="primary" onClick={handleSalvarObservacao}>Salvar Observação</Button></Modal.Footer>
      </Modal>
      <Modal show={showAcaoModal} onHide={() => setShowAcaoModal(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Adicionar / Editar Ação de Recuperação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group>
                <Form.Label>Ação de recuperação para o aluno neste indicador:</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={5} 
                    value={acaoAtual} 
                    onChange={(e) => setAcaoAtual(e.target.value)} 
                    placeholder="Descreva a ação de recuperação..."
                />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAcaoModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSalvarAcaoRecuperacao}>Salvar Ação</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvaliacaoEstudante;