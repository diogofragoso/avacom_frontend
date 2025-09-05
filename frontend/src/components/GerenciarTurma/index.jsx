import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Table, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import matriculaService from '../../services/matriculaService';
import ModalMatricularAluno from '../ModalMatricularAluno';
import AvaliacaoEstudante from '../AvaliacaoEstudante'; // <-- importa aqui
import { MdAddCircle } from 'react-icons/md';
import { FaTrash, FaCheckCircle } from 'react-icons/fa';

function GerenciarTurma() {
    const location = useLocation();
    const navigate = useNavigate();
    const { turma } = location.state || {};

    const [estudantes, setEstudantes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    // estados para avaliação
    const [avaliando, setAvaliando] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);

    useEffect(() => {
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

        if (turma?.id_turma) {
            carregarEstudantes();
        }
    }, [turma]);

    // Excluir estudante
    const handleExcluir = async (id_matricula) => {
        if (window.confirm("Deseja realmente excluir esta matrícula?")) {
            try {
                await matriculaService.removerMatricula(id_matricula);
                setEstudantes(estudantes.filter(e => e.id_matricula !== id_matricula));
            } catch (err) {
                console.error("Erro ao excluir matrícula:", err);
                setErro("Erro ao excluir matrícula.");
            }
        }
    };

    // Avaliar estudante
    const handleAvaliar = (estudante) => {
        setAlunoSelecionado(estudante);
        setAvaliando(true);
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Container className="mt-4">
                <Card className="shadow-lg">
                    <Card.Header className="bg-dark text-white">
                        <h4>Gerenciar Turma: {turma.nome_turma}</h4>
                    </Card.Header>
                    <Card.Body>
                        {/* Dados da turma */}
                        <Row>
                            <Col md={6}><strong>Curso:</strong> {turma.nome_curso}</Col>
                            <Col md={3}><strong>Período:</strong> {turma.periodo_turma}</Col>
                            <Col md={3}><strong>Início:</strong> {new Date(turma.data_inicio_turma).toLocaleDateString('pt-BR')}</Col>
                        </Row>
                        <Row className="mt-2">
                            <Col md={3}><strong>Máx. de Alunos:</strong> {turma.max_aluno_turma}</Col>
                        </Row>
                        <hr />

                        {/* Se estiver avaliando, mostra o AvaliacaoEstudante */}
                        {avaliando && alunoSelecionado ? (
                            <>
                                <h5>Avaliando: {alunoSelecionado.nome_aluno}</h5>
                                <AvaliacaoEstudante ucs={10} indicadores={9} />
                                <Button variant="secondary" className="mt-3 me-2" onClick={() => setAvaliando(false)}>
                                    Voltar para lista de estudantes
                                </Button>
                            </>
                        ) : (
                            <>
                                {/* Lista de estudantes */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5>Estudantes Matriculados</h5>
                                    <Button variant="primary" onClick={() => setMostrarModal(true)}>
                                        Matricular Estudante <MdAddCircle className="ms-1" />
                                    </Button>
                                </div>

                                {carregando && <Spinner animation="border" />}
                                {erro && <Alert variant="danger">{erro}</Alert>}
                                {!carregando && estudantes.length === 0 && (
                                    <p className="text-muted">Nenhum estudante matriculado ainda.</p>
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
                                            {estudantes.map((estudante, index) => (
                                                <tr key={index}>
                                                    <td>{estudante.nome_aluno}</td>
                                                    <td>{estudante.email_aluno}</td>
                                                    <td className="text-center">
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleExcluir(estudante.id_matricula)}
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

                        <Button variant="secondary" className="mt-3 me-3" onClick={() => navigate(-1)}>
                            Voltar para Turmas
                        </Button>
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal de matrícula */}
            <ModalMatricularAluno
                show={mostrarModal}
                handleClose={() => setMostrarModal(false)}
                turmaId={turma.id_turma}
                cursoId={turma.id_curso}
                onMatriculaRealizada={() => {
                    setCarregando(true);
                    setErro(null);
                    matriculaService.getAlunosMatriculadosPorTurma(turma.id_turma)
                        .then(setEstudantes)
                        .catch(() => setErro('Erro ao atualizar alunos'))
                        .finally(() => setCarregando(false));
                }}
            />
        </motion.div>
    );
}

export default GerenciarTurma;
