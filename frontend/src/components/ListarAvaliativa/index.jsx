import React, { useState, useEffect, useCallback } from 'react';
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

    // Versão otimizada com useCallback
    const buscarAvaliativas = useCallback(async () => {
        if (!id_indicador) {
            console.warn('ID do indicador não fornecido para buscar avaliações');
            return;
        }

        try {
            setLoading(true);
            const response = await avaliativaService.getAvaliativasPorIndicador(id_indicador);
            setAvaliativas(response || []); // Garante que sempre seja array
        } catch (error) {
            console.error('Erro ao buscar atividades avaliativas:', error);
            setFeedback({ 
                type: 'danger', 
                message: `Erro ao buscar atividades: ${error.message || 'Erro desconhecido'}` 
            });
        } finally {
            setLoading(false);
        }
    }, [id_indicador]);

    useEffect(() => {
        buscarAvaliativas();
    }, [buscarAvaliativas]);

    useEffect(() => {
        if (feedback.message) {
            const timer = setTimeout(() => setFeedback({ type: '', message: '' }), 2000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    const handleDelete = (id) => {
        if (!id) {
            console.error('ID inválido para exclusão');
            return;
        }
        setAvaliativaParaExcluir(id);
        setShowConfirmModal(true);
    };

    const confirmarExclusao = async () => {
        if (!avaliativaParaExcluir) {
            setFeedback({ type: 'warning', message: 'Nenhuma atividade selecionada para exclusão' });
            return;
        }

        try {
            await avaliativaService.deleteAvaliativa(avaliativaParaExcluir);
            await buscarAvaliativas();
            setFeedback({ type: 'success', message: 'Atividade excluída com sucesso!' });
        } catch (error) {
            console.error('Erro ao excluir atividade:', error);
            setFeedback({ 
                type: 'danger', 
                message: `Erro ao excluir atividade: ${error.message || 'Erro desconhecido'}` 
            });
        } finally {
            setShowConfirmModal(false);
            setAvaliativaParaExcluir(null);
        }
    };

    const handleEdit = (avaliativa) => {
        if (!avaliativa?.id_avaliativa) {
            console.error('Dados inválidos para edição');
            return;
        }
        
        setAvaliativaSelecionada(avaliativa);
        setDescricao(avaliativa.descricao_avaliativa || '');
        setShowModalEdit(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!avaliativaSelecionada?.id_avaliativa || !descricao.trim()) {
            setFeedback({ type: 'warning', message: 'Dados incompletos para atualização' });
            return;
        }

        try {
            await avaliativaService.updateAvaliativa(avaliativaSelecionada.id_avaliativa, {
                id_avaliativa: avaliativaSelecionada.id_avaliativa,
                descricao: descricao,
                id_indicador_fk: id_indicador
            });
            await buscarAvaliativas();
            setShowModalEdit(false);
            setFeedback({ type: 'success', message: 'Atividade atualizada com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar atividade:', error);
            setFeedback({ 
                type: 'danger', 
                message: `Erro ao atualizar: ${error.message || 'Erro desconhecido'}` 
            });
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        
        if (!novaDescricao.trim()) {
            setFeedback({ type: 'warning', message: 'A descrição não pode estar vazia' });
            return;
        }

        try {
            await avaliativaService.createAvaliativa({
                descricao: novaDescricao,
                id_indicador_fk: id_indicador
            });
            await buscarAvaliativas();
            setShowModalAdd(false);
            setNovaDescricao('');
            setFeedback({ type: 'success', message: 'Atividade criada com sucesso!' });
        } catch (error) {
            console.error('Erro ao criar atividade:', error);
            setFeedback({ 
                type: 'danger', 
                message: `Erro ao criar atividade: ${error.message || 'Erro desconhecido'}` 
            });
        }
    };

    // Restante do componente permanece idêntico ao seu original
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
                    <MdAddCircle style={{ marginLeft: '5px', fontSize: '30px', color: '#90caf9' }}/>
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
                                            console.error('Erro ao gerar texto com IA:', error);
                                            setFeedback({ type: 'danger', message: 'Erro ao gerar texto da IA' });
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