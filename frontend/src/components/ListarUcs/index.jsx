// Componente ListarUcs
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Modal, Form, InputGroup, ListGroup } from 'react-bootstrap';
import ucService from '../../services/ucService';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { FaTasks, FaPlus, FaTrash } from "react-icons/fa"; // Novos ícones
import { NavLink as NavLink2 } from 'react-router-dom';
import styles from './ListarUcs.module.css';

const ListarUcs = ({ ucs, feedback, setFeedback, onDeleteSuccess, onEditSuccess, curso }) => {
    const [editingUc, setEditingUc] = useState(null);
    const [nomeUc, setNomeUc] = useState('');
    const [numeroUc, setNumeroUc] = useState('');
    const [showModal, setShowModal] = useState(false);

    // --- NOVOS ESTADOS PARA O MODAL DE HAV (Habilidades, Atitudes e Valores) ---
    const [showHavModal, setShowHavModal] = useState(false);
    const [currentUcHav, setCurrentUcHav] = useState(null); // A UC que está sendo editada
    const [havList, setHavList] = useState([]); // Lista de HAVs dessa UC
    const [newHavText, setNewHavText] = useState(""); // Texto do input
    // ---------------------------------------------------------------------------

    const handleDelete = async (id_uc) => {
        if (window.confirm('Tem certeza que deseja excluir esta UC?')) {
            try {
                await ucService.deleteUc(id_uc);
                setFeedback({ type: 'success', message: 'UC excluída com sucesso!' });
                onDeleteSuccess();
            } catch (error) {
                console.error(error);
                setFeedback({ type: 'danger', message: 'Erro ao excluir a UC.' });
            }
        }
    };

    const handleEdit = (uc) => {
        setEditingUc(uc);
        setNomeUc(uc.nome_uc);
        setNumeroUc(uc.numero_uc);
        setShowModal(true);
    };

    const handleUpdateUc = async () => {
        try {
            const response = await ucService.updateUc(editingUc.id_uc, {
                nome_uc: nomeUc,
                numero_uc: numeroUc
            });
            setFeedback({ type: 'success', message: 'UC editada com sucesso!' });
            onEditSuccess();
            setShowModal(false);
        } catch (error) {
            console.error("Erro ao editar UC:", error);
            const msg = error.response?.data?.error || 'Erro ao editar a UC.';
            setFeedback({ type: 'danger', message: msg });
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // --- NOVAS FUNÇÕES PARA GERENCIAR HAV ---

    const handleOpenHavModal = (uc) => {
        setCurrentUcHav(uc);
        // AQUI: Idealmente você faria um fetch para buscar as HAVs já salvas no banco para esta UC
        // Por enquanto, iniciamos vazio ou com dados mockados se existirem no objeto 'uc'
        setHavList(uc.habilidades || []); 
        setNewHavText("");
        setShowHavModal(true);
    };

    const handleAddHav = () => {
        if (!newHavText.trim()) return;
        setHavList([...havList, newHavText.trim()]);
        setNewHavText("");
    };

    const handleRemoveHav = (index) => {
        const newList = havList.filter((_, i) => i !== index);
        setHavList(newList);
    };

    const handleSaveHav = async () => {
        try {
            // AQUI: Você chamaria o serviço para salvar no banco de dados
            // Exemplo: await ucService.saveHavs(currentUcHav.id_uc, havList);
            
            console.log("Salvando HAVs para a UC:", currentUcHav.nome_uc, havList);
            
            setFeedback({ type: 'success', message: 'Competências definidas com sucesso!' });
            setShowHavModal(false);
            // onEditSuccess(); // Se necessário recarregar a lista
        } catch (error) {
            setFeedback({ type: 'danger', message: 'Erro ao salvar competências.' });
        }
    };
    // ----------------------------------------

    return (
        <Container fluid className="mt-5">
            <h2 className="mb-4">Unidades Curriculares</h2>

            <Row className="g-4">
                {ucs.map((uc) => (
                    <Col key={uc.id_uc} md={4} className="mb-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                           <Card className={`${styles.customCard} w-100`}>
                                <NavLink2
                                    to="/PainelIndicadores"
                                    state={{ uc, curso }}
                                    className="text-decoration-none text-dark"
                                >
                                    <Card.Body>
                                        <Card.Title>{uc.nome_uc}</Card.Title>
                                        <Card.Text>UC: {uc.numero_uc}</Card.Text>
                                    </Card.Body>
                                </NavLink2>

                                <Card.Footer className="d-flex justify-content-between align-items-center">
                                    {/* Botão de Competências (NOVO) */}
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="text-white"
                                        title="Definir Habilidades, Atitudes e Valores"
                                        onClick={() => handleOpenHavModal(uc)}
                                    >
                                        <FaTasks className="me-1" /> Competências
                                    </Button>

                                    <div>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            title="Editar UC"
                                            onClick={() => handleEdit(uc)}
                                        >
                                            <GrEdit />
                                        </Button>
                                        <Button
                                            className="ms-2"
                                            variant="danger"
                                            size="sm"
                                            title="Excluir UC"
                                            onClick={() => handleDelete(uc.id_uc)}
                                        >
                                            <RiDeleteBin6Line />
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            {/* Modal de Edição da UC (Original) */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar UC</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome da UC</Form.Label>
                            <Form.Control
                                type="text"
                                value={nomeUc}
                                onChange={(e) => setNomeUc(e.target.value)}
                                placeholder="Digite o nome da UC"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Número da UC</Form.Label>
                            <Form.Control
                                type="text"
                                value={numeroUc}
                                onChange={(e) => setNumeroUc(e.target.value)}
                                placeholder="Digite o número da UC"
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleUpdateUc}>Salvar Alterações</Button>
                        <Button variant="secondary" className="ms-2" onClick={handleCloseModal}>Cancelar</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* --- NOVO MODAL: Gerenciar HAV --- */}
            <Modal show={showHavModal} onHide={() => setShowHavModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Competências da UC</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted small">
                        Cadastre abaixo as Habilidades, Atitudes e Valores que serão observados nesta UC.
                    </p>
                    
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Ex: Trabalho em equipe, Proatividade..."
                            value={newHavText}
                            onChange={(e) => setNewHavText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddHav()}
                        />
                        <Button variant="success" onClick={handleAddHav}>
                            <FaPlus /> Adicionar
                        </Button>
                    </InputGroup>

                    <ListGroup variant="flush" className="mb-3">
                        {havList.length === 0 && <div className="text-center text-muted fst-italic">Nenhuma competência cadastrada ainda.</div>}
                        {havList.map((item, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                {item}
                                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveHav(index)}>
                                    <FaTrash />
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowHavModal(false)}>Fechar</Button>
                    <Button variant="primary" onClick={handleSaveHav}>Salvar Lista</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ListarUcs;