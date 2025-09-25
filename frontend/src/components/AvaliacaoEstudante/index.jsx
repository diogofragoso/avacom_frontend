// Caminho: src/components/AvaliacaoEstudante.jsx
import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { MdAssignment, MdComment } from "react-icons/md";
import avaliacaoService from "../../services/avaliacaoService"; // Certifique-se que o caminho está correto

const estados = [
  { label: "Atendido", text: "A", variant: "success" },
  { label: "Não Atendido", text: "NA", variant: "danger" },
  { label: "Parcialmente", text: "PA", variant: "warning" },
  { label: "Não Avaliado", text: "", variant: "secondary" },
];

// Helper para converter a menção (texto) em um índice (número)
const mencaoParaIndice = (mencao) => {
  const idx = estados.findIndex((e) => e.text === (mencao || ""));
  return idx >= 0 ? idx : 3; // 3 = "Não Avaliado"
};

const AvaliacaoEstudante = ({
  matriz,
  idEstudante,
  idTurma,
  onSelecionarAtividade,
  onObservacao,
  // As props onSalvar e onSalvarTodos não serão usadas diretamente nesta versão,
  // pois a lógica de salvar foi internalizada
}) => {
  if (!matriz || !matriz.ucs) {
    return <div>Carregando dados de avaliação...</div>;
  }

  // Estado para os badges (ex: Atendido, Não Atendido)
  const [estadoMatriz, setEstadoMatriz] = useState(() =>
    matriz.ucs.map((uc) => uc.indicadores.map(() => 3))
  );

  // Estado para armazenar o ID da avaliação de cada indicador
  const [idAvaliacaoMatriz, setIdAvaliacaoMatriz] = useState(() =>
    matriz.ucs.map((uc) => uc.indicadores.map(() => null))
  );

  // Estados do Modal de Atividades
  const [showAtividadeModal, setShowAtividadeModal] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState({});
  const [modalContext, setModalContext] = useState(null);
  const [atividadesModal, setAtividadesModal] = useState([]);

  // EFEITO PARA CARREGAR OS DADOS SALVOS DO ALUNO
  useEffect(() => {
    const carregarAvaliacoesSalvas = async () => {
      // Cria cópias vazias das matrizes que serão preenchidas
      const novaMatrizEstado = matriz.ucs.map(uc => uc.indicadores.map(() => 3));
      const novaMatrizIdAvaliacao = matriz.ucs.map(uc => uc.indicadores.map(() => null));

      // Itera sobre cada indicador para buscar as avaliações
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
              }
            } catch (error) {
              console.error(`Erro ao buscar dados para o indicador ${indicador.id_indicador}:`, error);
            }
          }
        }
      }
      // Atualiza os estados do componente com os dados carregados
      setEstadoMatriz(novaMatrizEstado);
      setIdAvaliacaoMatriz(novaMatrizIdAvaliacao);
    };

    if (idEstudante) {
      carregarAvaliacoesSalvas();
    }
  }, [matriz, idEstudante]); // Executa sempre que a matriz ou o estudante mudar

  // Função para mudar o estado do badge ao ser clicado
  const handleClick = (ucIndex, indIndex) => {
    setEstadoMatriz((prev) => {
      const novaMatriz = prev.map(row => [...row]); // Cria uma cópia profunda para evitar mutação
      novaMatriz[ucIndex][indIndex] = (novaMatriz[ucIndex][indIndex] + 1) % estados.length;
      return novaMatriz;
    });
  };

  // Função para salvar a menção de UM indicador
  const handleAtualizarBadge = async (ucIndex, indIndex) => {
    const idAvaliacao = idAvaliacaoMatriz[ucIndex]?.[indIndex];
    if (!idAvaliacao) {
      alert("Avaliação não encontrada para este aluno. É necessário associar uma atividade avaliativa primeiro.");
      return;
    }
    
    const estadoIndex = estadoMatriz[ucIndex][indIndex];
    const estado = estados[estadoIndex];

    try {
      await avaliacaoService.atualizar(idAvaliacao, { mencao: estado.text });
      alert("Menção atualizada com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar a avaliação:", err);
      alert("Falha ao atualizar a menção.");
    }
  };

  // Abre o modal para selecionar atividades avaliativas
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

  // Confirma a seleção de atividades e chama a função do componente pai
  const handleConfirmarAtividade = () => {
    if (onSelecionarAtividade && modalContext) {
      const selecionadas = Object.entries(atividadeSelecionada)
        .filter(([_, checked]) => checked)
        .map(([id]) => id);

      onSelecionarAtividade({
        estudanteId: idEstudante,
        turmaId: idTurma,
        ucId: modalContext.ucId,
        indicadorId: modalContext.indicadorId,
        atividades: selecionadas,
      });
    }
    setShowAtividadeModal(false);
    setModalContext(null);
  };

  const maxIndicadores = Math.max(0, ...matriz.ucs.map((uc) => uc.indicadores.length));

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
                          {/* Esquerda: Estado */}
                          <div
                            className="flex-grow-1 d-flex justify-content-center align-items-center"
                            onClick={() => handleClick(ucIndex, indIndex)}
                            style={{ cursor: "pointer" }}
                          >
                            <Badge bg={estado?.variant}>{estado?.text || " "}</Badge>
                          </div>
                          {/* Linha divisória */}
                          <div style={{ width: "1px", backgroundColor: "#dee2e6", margin: "0 6px", alignSelf: "stretch" }}></div>
                          {/* Direita: Ícones */}
                          <div className="d-flex gap-2 justify-content-end align-items-center">
                            <FaSave
                              style={{ cursor: "pointer", color: "#0d6efd" }}
                              onClick={() => handleAtualizarBadge(ucIndex, indIndex)}
                              title="Salvar"
                            />
                            <MdAssignment
                              style={{ cursor: "pointer", color: "gray" }}
                              onClick={() => handleAbrirModalAtividade(uc.id_uc, indicador.id_indicador)}
                              title="Selecionar Atividade"
                            />
                            <MdComment
                              style={{ cursor: "pointer", color: "#198754" }}
                              onClick={() => onObservacao?.({/*...dados*/})}
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
    </div>
  );
};

export default AvaliacaoEstudante;