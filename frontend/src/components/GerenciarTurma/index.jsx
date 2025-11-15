// Caminho: src/components/GerenciarTurma/index.js

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import {
  Card,
  Button,
  Container,
  Table,
  Spinner,
  Alert,
  Row,
  Col,
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { MdAddCircle } from 'react-icons/md';
// 1. Importar o ícone de métricas
import { FaTrash, FaCheckCircle, FaChartBar } from 'react-icons/fa';

import matriculaService from '../../services/matriculaService';
import avaliacaoService from '../../services/avaliacaoService';

import ModalMatricularAluno from '../ModalMatricularAluno';
import AvaliacaoEstudante from '../AvaliacaoEstudante';
import ModalSelecionarAtividadeAvaliativa from '../ModalSelecionarAtividadeAvaliativa';

function GerenciarTurma() {
  const location = useLocation();
  const navigate = useNavigate();
  const { turma } = location.state || {};

  // 🔹 Estados principais
  const [estudantes, setEstudantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalAtividade, setMostrarModalAtividade] = useState(false);

  const [avaliando, setAvaliando] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  const [matrizAvaliacao, setMatrizAvaliacao] = useState(null);
  const [carregandoAvaliacao, setCarregandoAvaliacao] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

 

  // 🔹 Buscar estudantes da turma
  const carregarEstudantes = async () => {
    setCarregando(true);
    try {
      const alunos = await matriculaService.getAlunosMatriculadosPorTurma(
        turma.id_turma
      );
      setEstudantes(alunos);
    } catch (err) {
      console.error(err);
      setErro('Erro ao buscar estudantes.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (turma?.id_turma) carregarEstudantes();
  }, [turma?.id_turma]);

  // 🔹 Excluir matrícula
  const handleExcluir = async (id_matricula) => {
    if (!window.confirm('Deseja realmente excluir esta matrícula?')) return;
    try {
      await matriculaService.removerMatricula(id_matricula);
      setEstudantes((prev) =>
        prev.filter((e) => e.id_matricula !== id_matricula)
      );
    } catch (err) {
      console.error('Erro ao excluir matrícula:', err);
      setErro('Erro ao excluir matrícula.');
    }
  };

  // 🔹 Abrir avaliação para aluno
  const handleAvaliar = async (estudante) => {
    setAlunoSelecionado(estudante);
    setAvaliando(true);
    setCarregandoAvaliacao(true);
    try {
      const dados = await avaliacaoService.getMatriz(turma.id_curso_fk);
      setMatrizAvaliacao(dados);
    } catch (err) {
      console.error('Erro ao carregar matriz:', err);
      setErro('Erro ao buscar dados de avaliação.');
    } finally {
      setCarregandoAvaliacao(false);
    }
  };

  // 🔹 Selecionar atividades avaliativas
  const handleSelecionarAtividadeAvaliativa = async () => {
    if (!matrizAvaliacao) {
      setCarregandoAvaliacao(true);
      try {
        const dados = await avaliacaoService.getMatriz(turma.id_curso_fk);
        setMatrizAvaliacao(dados);
      } catch (err) {
        console.error('Erro ao carregar matriz para o modal:', err);
        setErro('Erro ao buscar dados de avaliação.');
      } finally {
        setCarregandoAvaliacao(false);
      }
    }
    setMostrarModalAtividade(true);
  };

  // 🔹 Navegar para gerenciar atividades
  const handleGerenciarAtividades = () => {
    navigate('/Home/PainelTurma/GerenciarAvaliativa', { state: { turma } });
  };

  // 2. Adicionar a função de navegação para métricas
  const handleVerMetricas = () => {
    // === AJUSTE AQUI ===
    // O caminho agora aponta para a rota "irmã" dentro do PainelTurma
    navigate('/Home/PainelTurma/MetricasTurmas', { state: { turma: turma } });
  };

  if (!turma) {
    return (
      <Container className="mt-4">
        <p>Turma não encontrada. Retorne e selecione uma turma.</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="mt-4">
        <Card className="shadow-lg">
          <Card.Header className="bg-dark text-white">
            <h4>Gerenciar Turma: {turma.nome_turma}</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <strong>Curso:</strong> {turma.nome_curso}
              </Col>
              <Col md={3}>
                <strong>Período:</strong> {turma.periodo_turma}
              </Col>
              <Col md={3}>
                <strong>Início:</strong>{' '}
                {new Date(turma.data_inicio_turma).toLocaleDateString('pt-BR')}
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={3}>
                <strong>Máx. de Alunos:</strong> {turma.max_aluno_turma}
              </Col>
            </Row>
            <hr />

            {/* 🔹 Avaliação de estudante */}
            {avaliando && alunoSelecionado ? (
              <>
                <h5>Avaliando: {alunoSelecionado.nome_aluno}</h5>
                {carregandoAvaliacao ? (
                  <Spinner animation="border" />
                ) : (
                  matrizAvaliacao && (
                    <AvaliacaoEstudante
                      matriz={matrizAvaliacao}
                      idCurso={turma.id_curso_fk}
                      idTurma={turma.id_turma}
                      idEstudante={alunoSelecionado.id_aluno}
                      turmaId={turma.id_turma}
                      avaliacaoId={alunoSelecionado.avaliacaoId || null}
                      onSalvar={async (dados) => {
                        try {
                          if (!dados.avaliacaoId) {
                            const payload = {
                              id_estudante_fk: dados.estudanteId,
                              id_turma_fk: dados.turmaId,
                              id_uc_fk: dados.ucId,
                              id_indicador_fk: dados.indicadorId,
                              mencao: dados.estado,
                            };
                            const nova = await avaliacaoService.salvar(payload);
                            console.log('Avaliação criada:', nova);

                            if (nova?.id_avaliacao) {
                              // Atualiza no estado do componente AvaliacaoEstudante
                              setAlunoSelecionado((prev) => ({
                                ...prev,
                                avaliacaoId: nova.id_avaliacao,
                              }));
                              return nova.id_avaliacao;
                            }
                          } else {
                            const payload = { mencao: dados.estado };
                            await avaliacaoService.atualizar(
                              dados.avaliacaoId,
                              payload
                            );
                            console.log('Avaliação atualizada!');
                            return dados.avaliacaoId;
                          }
                        } catch (err) {
                          console.error('Erro ao salvar avaliação:', err);
                          alert('Erro ao salvar avaliação!');
                        }
                      }}
                      onObservacao={async (obs) => {
                        console.log('Salvar observação:', obs);
                        try {
                          if (!obs.avaliacaoId) {
                            alert(
                              'Crie a avaliação primeiro antes de adicionar observação!'
                            );
                            return;
                          }
                          const payload = {
                            observacao_avaliacao: obs.observacao,
                          };
                          await avaliacaoService.atualizar(
                            obs.avaliacaoId,
                            payload
                          );
                          console.log('Observação salva!');
                        } catch (err) {
                          console.error('Erro ao salvar observação:', err);
                        }
                      }}
                    />
                  )
                )}
                <Button
                  variant="secondary"
                  className="mt-3 me-2"
                  onClick={() => setAvaliando(false)}
                >
                  Voltar para lista de estudantes
                </Button>
              </>
            ) : (
              <>
                {/* 🔹 Lista de estudantes */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Estudantes Matriculados</h5>
                  <div>
                    {/* 3. Adicionar o botão de métricas */}
                    <Button
                      variant="outline-primary"
                      className="me-2"
                      title="Ver Métricas da Turma"
                      onClick={handleVerMetricas}
                    >
                      <FaChartBar className="me-1" />
                      Métricas
                    </Button>

                    <Button
                      variant="secondary"
                      className="me-2"
                      onClick={handleGerenciarAtividades}
                    >
                      Gerenciar Atividades
                    </Button>
                    <Button
                      variant="info"
                      className="me-2"
                      onClick={handleSelecionarAtividadeAvaliativa}
                    >
                      Selecionar avaliativas
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => setMostrarModal(true)}
                    >
                      Matricular Estudante <MdAddCircle className="ms-1" />
                    </Button>
                  </div>
                </div>

                {carregando && <Spinner animation="border" />}
                {erro && <Alert variant="danger">{erro}</Alert>}
                {!carregando && estudantes.length === 0 && (
                  <p className="text-muted">
                    Nenhum estudante matriculado ainda.
                  </p>
                )}

                {estudantes.length > 0 && (
                  <Table striped bordered hover responsive>
                    <thead className="table-dark">
                      <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Excluir</th>
                        <th>Avaliar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estudantes.map((estudante) => (
                        <tr key={estudante.id_matricula}>
                          <td>{estudante.nome_aluno}</td>
                          <td>{estudante.email_aluno}</td>
                          <td className="text-center">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleExcluir(estudante.id_matricula)
                              }
                            >
                              <FaTrash />
                            </Button>
                          </td>
                          <td className="text-center">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleAvaliar(estudante)}
                            >
                              <FaCheckCircle />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </>
            )}

            <Button
              variant="secondary"
              className="mt-3 me-3"
              onClick={() => navigate(-1)}
            >
              Voltar para Turmas
            </Button>
          </Card.Body>
        </Card>
      </Container>

      {/* 🔹 Modal matricular */}
      <ModalMatricularAluno
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        turmaId={turma.id_turma}
        cursoId={turma.id_curso_fk}
        onMatriculaRealizada={carregarEstudantes}
      />

      {/* 🔹 Modal selecionar atividade */}
      <ModalSelecionarAtividadeAvaliativa
        show={mostrarModalAtividade}
        handleClose={() => setMostrarModalAtividade(false)}
        ucs={matrizAvaliacao?.ucs}
        onSelecionar={(atividade) => setAtividadeSelecionada(atividade)}
      />
    </motion.div>
  );
}

export default GerenciarTurma;