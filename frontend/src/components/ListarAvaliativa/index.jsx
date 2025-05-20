import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Container, Row, Col, Button, Modal, Form, Spinner, Alert, Accordion
} from 'react-bootstrap';
import avaliativaService from '../../services/avaliativaService';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { MdAddCircle } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import TituloAvaliativa from '../TituloAvaliativa';
import styles from './ListarAvaliativa.module.css';


const ListarAvaliativa = ({ id_indicador = null }) => {
    const [avaliativas, setAvaliativas] = useState([]);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [avaliativaSelecionada, setAvaliativaSelecionada] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [novaDescricao, setNovaDescricao] = useState('');
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [loadingIA, setLoadingIA] = useState(false);
    const [respostaIA, setRespostaIA] = useState('');


    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [avaliativaParaExcluir, setAvaliativaParaExcluir] = useState(null);

    const location = useLocation();
    const { nome_uc, nome_indicador, indicador } = location.state || {};

    useEffect(() => {
        if (id_indicador) buscarAvaliativas();
    }, [id_indicador]);

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

    const handleDelete = (id) => {
        setAvaliativaParaExcluir(id);
        setShowConfirmModal(true);
    };

    const confirmarExclusao = async () => {
        try {
            await avaliativaService.deleteAvaliativa(avaliativaParaExcluir);
            buscarAvaliativas();
            setFeedback({ type: 'success', message: 'Atividade excluída com sucesso!' });
        } catch (error) {
            setFeedback({ type: 'danger', message: 'Erro ao excluir atividade: ' + error.message });
        } finally {
            setShowConfirmModal(false);
            setAvaliativaParaExcluir(null);
        }
    };

    const handleEdit = (avaliativa) => {
        setAvaliativaSelecionada(avaliativa);
        setDescricao(avaliativa.descricao_avaliativa);
        setShowModalEdit(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await avaliativaService.updateAvaliativa(avaliativaSelecionada.id_avaliativa, {
                id_avaliativa: avaliativaSelecionada.id_avaliativa,
                descricao: descricao,
                id_indicador_fk: id_indicador
            });
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
            await avaliativaService.createAvaliativa({
                descricao: novaDescricao,
                id_indicador_fk: id_indicador
            });
            buscarAvaliativas();
            setShowModalAdd(false);
            setNovaDescricao('');
            setFeedback({ type: 'success', message: 'Atividade criada com sucesso!' });
        } catch (error) {
            setFeedback({ type: 'danger', message: 'Erro ao criar atividade: ' + error.message });
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Container fluid className="mt-1 position-relative">              

                 <TituloAvaliativa
                    nome_uc={nome_uc}                   
                    nome_indicador={nome_indicador}
                    avaliativas={avaliativas}
                />
              


                <Button variant="dark" className="mb-4" onClick={() => setShowModalAdd(true)}>
                    Adicionar Atividade 
                    <MdAddCircle 
                    style={{ marginLeft: '5px' , fontSize: '30px', color: '#90caf9'}}/>
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
                    <Accordion alwaysOpen className="w-100">
                        {avaliativas.map((avaliativa, index) => (
                            <Accordion.Item
                                key={avaliativa.id_avaliativa}
                                eventKey={index.toString()}
                                className={styles.customCard}
                            >
                                <Accordion.Header>
                                    <p>Atividade avaliativa opção: {index + 1}</p>
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
                                    as="textarea"
                                    rows={10}
                                    placeholder="Digite a descrição da atividade"
                                    // type="text"
                                    value={novaDescricao}
                                    onChange={(e) => setNovaDescricao(e.target.value)}
                                    required
                                    style={{ resize: 'vertical' }}
                                />
                            </Form.Group>
                            <Modal.Footer>
                                <Button
                                    variant="info"                                  
                                    disabled={loadingIA || !novaDescricao.trim()}
                                    onClick={async () => {
                                        try {
                                            setLoadingIA(true);
                                            const resposta = await avaliativaService.gerarTextoIA(`Por favor, me ajude a escrever uma atividade avaliativa baseada neste texto: ${novaDescricao}`);
                                            setRespostaIA(resposta);
                                            setNovaDescricao(resposta);
                                        } catch (error) {
                                            alert('Erro ao gerar texto da IA: ' + error.message);
                                        } finally {
                                            setLoadingIA(false);
                                        }
                                    }}
                                >
                                    {loadingIA ? 'Gerando...' : 'Gerar Texto IA'}
                                    {loadingIA && <Spinner animation="border" size="sm" className="ms-2" />}
                                </Button>

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
                                    as="textarea"
                                    rows={10}
                                    placeholder="Digite a descrição da atividade"
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    required
                                    style={{ resize: 'vertical' }}
                                />
                            </Form.Group>
                            <Modal.Footer>
                                <Button variant="dark" type="submit">Salvar</Button>
                                <Button variant="secondary" onClick={() => setShowModalEdit(false)}>Cancelar</Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Modal Confirmação Exclusão */}
                <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Confirmar Exclusão</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Tem certeza que deseja excluir esta atividade avaliativa?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={confirmarExclusao}>
                                Excluir
                            </Button>
                        </Modal.Footer>
                    </motion.div>
                </Modal>
            </Container>
        </motion.div>
    );
};

export default ListarAvaliativa;
