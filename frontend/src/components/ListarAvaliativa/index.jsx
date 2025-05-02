import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import avaliativaService from '../../services/avaliativaService';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import styles from './ListarAvaliativa.module.css';

const ListarAvaliativa = ({ id_uc }) => {
    const [avaliativas, setAvaliativas] = useState([]);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [avaliativaSelecionada, setAvaliativaSelecionada] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [novaDescricao, setNovaDescricao] = useState('');
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    useEffect(() => {
        if (id_uc) buscarAvaliativas();
    }, [id_uc]);

    useEffect(() => {
        if (feedback.message) {
            const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 2000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    const buscarAvaliativas = async () => {
        try {
            setLoading(true);
            const response = await avaliativaService.getAvaliativasPorUc(id_uc);
            setAvaliativas(response);
        } catch (error) {
            console.error('Erro ao buscar avaliativas:', error);
            setFeedback({ type: 'danger', message: 'Erro ao buscar atividades: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta atividade avaliativa?')) {
            try {
                await avaliativaService.deleteAvaliativa(id);
                buscarAvaliativas();
                setFeedback({ type: 'success', message: 'Atividade excluída com sucesso!' });
            } catch (error) {
                console.error('Erro ao excluir atividade:', error);
                setFeedback({ type: 'danger', message: 'Erro ao excluir atividade: ' + error.message });
            }
        }
    };

    const handleEdit = (avaliativa) => {
        setAvaliativaSelecionada(avaliativa);
        setDescricao(avaliativa.descricao);
        setShowModalEdit(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await avaliativaService.updateAvaliativa(avaliativaSelecionada.id, { descricao });
            buscarAvaliativas();
            setShowModalEdit(false);
            setFeedback({ type: 'success', message: 'Atividade atualizada com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar atividade:', error);
            setFeedback({ type: 'danger', message: 'Erro ao atualizar: ' + error.message });
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await avaliativaService.createAvaliativa({ descricao: novaDescricao, id_uc_fk: id_uc });
            buscarAvaliativas();
            setShowModalAdd(false);
            setNovaDescricao('');
            setFeedback({ type: 'success', message: 'Atividade criada com sucesso!' });
        } catch (error) {
            console.error('Erro ao criar atividade:', error);
            setFeedback({ type: 'danger', message: 'Erro ao criar atividade: ' + error.message });
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Container fluid className="mt-5 position-relative">
                <h2 className="mb-4">Atividades Avaliativas</h2>

                <Button variant="dark" className="mb-4" onClick={() => setShowModalAdd(true)}>
                    Adicionar Atividade
                </Button>

                {feedback.message && (
                    <div className={styles.feedbackAlertContainer}>
                        <Alert variant={feedback.type} className={styles.feedbackAlert}>
                            {feedback.message}
                        </Alert>
                    </div>
                )}

                <Row>
                    {loading ? (
                        <div className="d-flex justify-content-center mt-5">
                            <Spinner animation="border" variant="dark" />
                        </div>
                    ) : avaliativas.length > 0 ? (
                        avaliativas.map(avaliativa => (
                            <Col key={avaliativa.id} md={4} className="mb-4">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                                    <Card className={styles.customCard}>
                                        <Card.Body>
                                            <Card.Title>ID UC: {avaliativa.id_uc_fk}</Card.Title>
                                            <Card.Text>{avaliativa.descricao}</Card.Text>
                                        </Card.Body>
                                        <Card.Footer className="d-flex justify-content-start">
                                            <Button variant="primary" size="sm" onClick={() => handleEdit(avaliativa)}>
                                                <GrEdit />
                                            </Button>
                                            <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(avaliativa.id)}>
                                                <RiDeleteBin6Line />
                                            </Button>
                                        </Card.Footer>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))
                    ) : (
                        <Col><p className="text-muted mt-3">Nenhuma atividade encontrada.</p></Col>
                    )}
                </Row>

                {/* Modal Adicionar */}
                <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Adicionar Nova Atividade</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleCreate}>
                            <Form.Group className="mb-3">
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={novaDescricao}
                                    onChange={(e) => setNovaDescricao(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Modal.Footer>
                                <Button variant="dark" type="submit">Cadastrar</Button>
                                <Button variant="secondary" onClick={() => setShowModalAdd(false)}>Cancelar</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Modal Editar */}
                <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Atividade</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdate}>
                            <Form.Group className="mb-3">
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Modal.Footer>
                                <Button variant="dark" type="submit">Salvar</Button>
                                <Button variant="secondary" onClick={() => setShowModalEdit(false)}>Cancelar</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

            </Container>
        </motion.div>
    );
};

export default ListarAvaliativa;
