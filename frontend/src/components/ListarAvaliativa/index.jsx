import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button, Modal, Form, Spinner, Alert, Accordion } from 'react-bootstrap';
import avaliativaService from '../../services/avaliativaService';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { useLocation } from 'react-router-dom'; // Importação corrigida
import styles from './ListarAvaliativa.module.css';

const ListarAvaliativa = ({ id_indicador = null,  onDeleteSuccess, onEditSuccess }) => {
    const [avaliativas, setAvaliativas] = useState([]);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [avaliativaSelecionada, setAvaliativaSelecionada] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [novaDescricao, setNovaDescricao] = useState('');
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const location = useLocation();
    const { nome_uc, nome_indicador,indicador } = location.state || {};  // Recebendo os dados via state




    useEffect(() => {
        if (id_indicador) buscarAvaliativas();
    }, [id_indicador]);

    // useEffect(() => {
    //     buscarAvaliativas();
    // }, []);

    useEffect(() => {
        if (feedback.message) {
            const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 2000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    const buscarAvaliativas = async () => {
        if (!id_indicador) return;
        try {
            setLoading(true);
            const response = await avaliativaService.getAvaliativasPorIndicador(id_indicador);            
            setAvaliativas(response);           
        } catch (error) {
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
            setFeedback({ type: 'danger', message: 'Erro ao atualizar: ' + error.message });
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await avaliativaService.createAvaliativa({ descricao: novaDescricao, id_indicador_fk: id_indicador });
            buscarAvaliativas();
            setShowModalAdd(false);
            setNovaDescricao('');
            setFeedback({ type: 'success', message: 'Atividade criada com sucesso!' });
        } catch (error) {
            alert("ID IndicadoR: " + id_indicador );
            setFeedback({ type: 'danger', message: 'Erro ao criar atividade: ' + error.message + novaDescricao +  ' ' + id_indicador });
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

                {loading ? (
                    <div className="d-flex justify-content-center mt-5">
                        <Spinner animation="border" variant="dark" />
                    </div>
                ) : avaliativas.length > 0 ? (
                    <Accordion  alwaysOpen className="w-100">
                        {avaliativas.map((avaliativa, index) => (
                            <Accordion.Item
                                key={avaliativa.id_avaliativa}
                                eventKey={index.toString()}
                                className={styles.customCard}
                            >
                                <Accordion.Header>
                                    <p>
                                        <strong>ID:</strong> {avaliativa.id_indicador_fk}{' '}
                                        <strong>UC:</strong> {nome_uc}{' '}
                                        <strong>Indicador:</strong> {nome_indicador}
                                    </p>



                                </Accordion.Header>
                                <Accordion.Body>
                                    <p>{avaliativa.descricao_avaliativa}</p>
                                    <div className="d-flex justify-content-start mt-3">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleEdit(avaliativa)}
                                        >
                                            <GrEdit />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleDelete(avaliativa.id_avaliativa)}
                                        >
                                            <RiDeleteBin6Line />
                                        </Button>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                ) : (
                    <p className="text-muted mt-3">Nenhuma atividade encontrada.</p>
                )}


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
                                <Button variant="dark" type="submit">Salvar</Button>
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
