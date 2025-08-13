import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Table, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import matriculaService from '../../services/matriculaService';
import ModalMatricularAluno from '../ModalMatricularAluno';
import { MdAddCircle } from 'react-icons/md';

function GerenciarTurma() {
    const location = useLocation();
    const navigate = useNavigate();
    const { turma } = location.state || {};

    const [estudantes, setEstudantes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    // Estado para controle do modal
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        const carregarEstudantes = async () => {
            try {
                const alunos = await matriculaService.getAlunosMatriculados(turma.id_turma);
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
                        <Row>
                            <Col md={6}><strong>Curso:</strong> {turma.nome_curso}</Col>
                            <Col md={3}><strong>Período:</strong> {turma.periodo_turma}</Col>
                            <Col md={3}><strong>Início:</strong> {new Date(turma.data_inicio_turma).toLocaleDateString('pt-BR')} </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col md={3}><strong>Máx. de Alunos:</strong> {turma.max_aluno_turma}</Col>
                            <Col md={9}></Col>
                        </Row>
                        <hr />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Estudantes Matriculados</h5>
                            <Button variant="primary" onClick={() => setMostrarModal(true)}>
                                + Adicionar Estudante <MdAddCircle className="ms-1" />
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
                                        <th>CPF</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estudantes.map((estudante, index) => (
                                        <tr key={index}>
                                            <td>{estudante.nome_estudante}</td>
                                            <td>{estudante.cpf_estudante}</td>
                                            <td>{estudante.email_estudante}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}

                        <Button variant="secondary" className="mt-3" onClick={() => navigate(-1)}>
                            Voltar para Turmas
                        </Button>
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal precisa estar dentro do JSX retornado */}
            <ModalMatricularAluno
                show={mostrarModal}
                handleClose={() => setMostrarModal(false)}
                turmaId={turma.id_turma}
                cursoId={turma.id_curso}
                onMatriculaRealizada={() => {
                    setCarregando(true);
                    setErro(null);
                    matriculaService.getAlunosMatriculados(turma.id_turma)
                        .then(setEstudantes)
                        .catch(() => setErro('Erro ao atualizar alunos'))
                        .finally(() => setCarregando(false));
                }}
            />
        </motion.div>
    );
}

export default GerenciarTurma;
