// 1. ADICIONADO 'Outlet' À IMPORTAÇÃO
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Table, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { MdAddCircle } from 'react-icons/md';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';

import matriculaService from '../../services/matriculaService';
import avaliacaoService from '../../services/avaliacaoService';

import ModalMatricularAluno from '../ModalMatricularAluno';
import AvaliacaoEstudante from '../AvaliacaoEstudante';
import ModalSelecionarAtividadeAvaliativa from '../ModalSelecionarAtividadeAvaliativa';

function GerenciarTurma() {
  const location = useLocation();
  const navigate = useNavigate();
  const { turma } = location.state || {};

  // Estados dos estudantes e UI
  const [estudantes, setEstudantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalAtividade, setMostrarModalAtividade] = useState(false);

  // Estados de Avaliação
  const [avaliando, setAvaliando] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [matrizAvaliacao, setMatrizAvaliacao] = useState(null);
  const [carregandoAvaliacao, setCarregandoAvaliacao] = useState(false);
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

  useEffect(() => {
    if (!turma?.id_turma) return;
    const carregarEstudantes = async () => {
      try {
        const alunos = await matriculaService.getAlunosMatriculadosPorTurma(turma.id_turma);
        setEstudantes(alunos);
      } catch (err) {
        setErro('Erro ao buscar estudantes.');
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };
    carregarEstudantes();
  }, [turma?.id_turma]);

  const handleExcluir = async (id_matricula) => {
    if (!window.confirm("Deseja realmente excluir esta matrícula?")) return;
    try {
      await matriculaService.removerMatricula(id_matricula);
      setEstudantes(estudantes.filter(e => e.id_matricula !== id_matricula));
    } catch (err) {
      console.error("Erro ao excluir matrícula:", err);
      setErro("Erro ao excluir matrícula.");
    }
  };

  const handleAvaliar = async (estudante) => {
    setAlunoSelecionado(estudante);
    setAvaliando(true);
    setCarregandoAvaliacao(true);
    try {
      const dados = await avaliacaoService.getMatriz(turma.id_curso_fk);
      setMatrizAvaliacao(dados);
    } catch (err) {
      console.error("Erro ao carregar matriz:", err);
      setErro("Erro ao buscar dados de avaliação.");
    } finally {
      setCarregandoAvaliacao(false);
    }
  };

  const handleSelecionarAtividadeAvaliativa = async () => {
    setCarregandoAvaliacao(true);
    try {
      if (!matrizAvaliacao) {
        const dados = await avaliacaoService.getMatriz(turma.id_curso_fk);
        setMatrizAvaliacao(dados);
      }
      setMostrarModalAtividade(true);
    } catch (err) {
      console.error("Erro ao carregar matriz para o modal:", err);
      setErro("Erro ao buscar dados de avaliação.");
    } finally {
      setCarregandoAvaliacao(false);
    }
  };

  // 2. NOVA FUNÇÃO ADICIONADA PARA O NOVO BOTÃO
  const handleGerenciarAtividades = () => {
    // Usa a rota aninhada 'GerenciarAvaliativa'
    navigate('GerenciarAvaliativa', { state: { turma } });
  };

  if (!turma) {
    return (
      <Container className="mt-4">
        <p>Turma não encontrada. Retorne e selecione uma turma.</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
      </Container>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container className="mt-4">
        <Card className="shadow-lg">
          <Card.Header className="bg-dark text-white">
            <h4>Gerenciar Turma: {turma.nome_turma}</h4>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}><strong>Curso:</strong> {turma.nome_curso}</Col>
              <Col md={3}><strong>Período:</strong> {turma.periodo_turma}</Col>
              <Col md={3}><strong>Início:</strong> {new Date(turma.data_inicio_turma).toLocaleDateString('pt-BR')}</Col>
            </Row>
            <Row className="mt-2">
              <Col md={3}><strong>Máx. de Alunos:</strong> {turma.max_aluno_turma}</Col>
            </Row>
            <hr />

            {avaliando && alunoSelecionado ? (
              <>
                <h5>Avaliando: {alunoSelecionado.nome_aluno}</h5>
                {carregandoAvaliacao ? (
                  <Spinner animation="border" />
                ) : (
                  matrizAvaliacao && <AvaliacaoEstudante
                    matriz={matrizAvaliacao}
                    idCurso={turma.id_curso_fk}
                    idTurma={turma.id_turma}
                    idEstudante={alunoSelecionado.id_aluno}
                  />
                )}
                <Button variant="secondary" className="mt-3 me-2" onClick={() => setAvaliando(false)}>
                  Voltar para lista de estudantes
                </Button>
              </>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Estudantes Matriculados</h5>
                  <div>
                    {/* 3. NOVO BOTÃO ADICIONADO AO LADO DO EXISTENTE */}
                    <Button variant="secondary" className="me-2" onClick={handleGerenciarAtividades}>
                      Gerenciar Atividades
                    </Button>
                    <Button variant="info" className="me-2" onClick={handleSelecionarAtividadeAvaliativa}>
                      Selecionar avaliativas
                    </Button>
                    <Button variant="primary" onClick={() => setMostrarModal(true)}>
                      Matricular Estudante <MdAddCircle className="ms-1" />
                    </Button>
                  </div>
                </div>

                {carregando && <Spinner animation="border" />}
                {erro && <Alert variant="danger">{erro}</Alert>}
                {!carregando && estudantes.length === 0 && <p className="text-muted">Nenhum estudante matriculado ainda.</p>}

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
                            <Button variant="danger" size="sm" onClick={() => handleExcluir(estudante.id_matricula)}><FaTrash /></Button>
                          </td>
                          <td className="text-center">
                            <Button variant="success" size="sm" onClick={() => handleAvaliar(estudante)}><FaCheckCircle /></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </>
            )}

            <Button variant="secondary" className="mt-3 me-3" onClick={() => navigate(-1)}>Voltar para Turmas</Button>
          </Card.Body>
        </Card>

        {/* 4. ADICIONADO O OUTLET PARA RENDERIZAR A ROTA FILHA */}
        <div className="mt-4">
            <Outlet />
        </div>
      </Container>

      <ModalMatricularAluno
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        turmaId={turma.id_turma}
        cursoId={turma.id_curso_fk}
        onMatriculaRealizada={() => { /* ... */ }}
      />

      <ModalSelecionarAtividadeAvaliativa
        show={mostrarModalAtividade}
        handleClose={() => setMostrarModalAtividade(false)}
        ucs={matrizAvaliacao?.ucs}
        onSelecionar={(atividade) => {
          setAtividadeSelecionada(atividade);
        }}
      />
    </motion.div>
  );
}

export default GerenciarTurma;