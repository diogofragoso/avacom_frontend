// Componente ListarUcs
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import ucService from '../../services/ucService';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { NavLink as NavLink2 } from 'react-router-dom'; // Importação corrigida
import styles from './ListarUcs.module.css';

const ListarUcs = ({ ucs, feedback, setFeedback, onDeleteSuccess, onEditSuccess, curso }) => {
    const [editingUc, setEditingUc] = useState(null);
    const [nomeUc, setNomeUc] = useState('');
    const [numeroUc, setNumeroUc] = useState('');
    const [showModal, setShowModal] = useState(false);
    

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
                                    state={{ uc, curso }}  // Passando o estado de 'curso' junto com a UC
                                    className="text-decoration-none text-dark"
                                >
                                    <Card.Body>
                                        <Card.Title>{uc.nome_uc}</Card.Title>
                                        <Card.Text>UC: {uc.numero_uc}</Card.Text>
                                    </Card.Body>
                                </NavLink2>

                                <Card.Footer>
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
                                </Card.Footer>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            {/* Modal de Edição */}
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
        </Container>
    );
};

export default ListarUcs;
