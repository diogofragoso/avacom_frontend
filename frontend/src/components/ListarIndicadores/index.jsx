import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import indicadorService from '../../services/indicadorService';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";

const ListarIndicadores = ({ id_uc }) => {
    const [indicadores, setIndicadores] = useState([]);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [indicadorSelecionado, setIndicadorSelecionado] = useState(null);
    const [numeroIndicador, setNumeroIndicador] = useState('');
    const [descricaoIndicador, setDescricaoIndicador] = useState('');
    const [novoNumeroIndicador, setNovoNumeroIndicador] = useState('');
    const [novaDescricaoIndicador, setNovaDescricaoIndicador] = useState('');
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    useEffect(() => {
        if (id_uc) {
            buscarIndicadores();
        }
    }, [id_uc]);

    useEffect(() => {
        if (feedback.message) {
            const timer = setTimeout(() => {
                setFeedback({ type: '', message: '' });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    const buscarIndicadores = async () => {
        try {
            setLoading(true);
            const response = await indicadorService.getIndicadoresPorUc(id_uc);
            setIndicadores(response);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
            setFeedback({ type: 'danger', message: 'Erro ao buscar indicadores: ' + error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id_indicador) => {
        if (window.confirm('Tem certeza que deseja excluir este indicador?')) {
            try {
                await indicadorService.deleteIndicador(id_indicador);
                buscarIndicadores();
                setFeedback({ type: 'success', message: 'Indicador excluído com sucesso!' });
            } catch (error) {
                console.error('Erro ao excluir indicador:', error);
                setFeedback({ type: 'danger', message: 'Erro ao excluir indicador: ' + error.message });
            }
        }
    };

    const handleEdit = (indicador) => {
        setIndicadorSelecionado(indicador);
        setNumeroIndicador(indicador.numero_indicador);
        setDescricaoIndicador(indicador.descricao_indicador);
        setShowModalEdit(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await indicadorService.updateIndicador(indicadorSelecionado.id_indicador, {
                numero_indicador: numeroIndicador,
                descricao_indicador: descricaoIndicador
            });
            buscarIndicadores();
            setShowModalEdit(false);
            setFeedback({ type: 'success', message: 'Indicador atualizado com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar indicador:', error);
            setFeedback({ type: 'danger', message: 'Erro ao atualizar indicador: ' + error.message });
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await indicadorService.createIndicador({
                numero_indicador: novoNumeroIndicador,
                descricao_indicador: novaDescricaoIndicador,
                id_uc_fk: id_uc
            });
            buscarIndicadores();
            setShowModalAdd(false);
            setNovoNumeroIndicador('');
            setNovaDescricaoIndicador('');
            setFeedback({ type: 'success', message: 'Indicador criado com sucesso!' });
        } catch (error) {
            console.error('Erro ao criar indicador:', error);
            setFeedback({ type: 'danger', message: 'Erro ao criar indicador: ' + error.message });
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Container className="mt-5 position-relative">

                <h2 className="mb-4">Indicadores</h2>

                <Button variant="dark" className="mb-4" onClick={() => setShowModalAdd(true)}>
                    Adicionar Indicador
                </Button>

                {/* Área de Feedback */}
                <div className="position-relative">
                    {feedback.message && (
                        <div style={{
                            position: 'absolute',
                            top: '-60px',
                            left: 0,
                            right: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}>
                            <Alert
                                variant={feedback.type === 'success' ? 'success' : 'danger'}
                                className="text-center"
                                style={{ width: '50%', opacity: 0.95 }}
                            >
                                {feedback.message}
                            </Alert>
                        </div>
                    )}
                </div>

                {/* Lista de Indicadores */}
                <Row>
                    {loading ? (
                        <div className="d-flex justify-content-center mt-5">
                            <Spinner animation="border" variant="dark" />
                        </div>
                    ) : indicadores.length > 0 ? (
                        indicadores.map((indicador) => (
                            <Col key={indicador.id_indicador} md={4} className="mb-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card style={{ width: '18rem' }}>
                                        <Card.Body>
                                            <Card.Title>{indicador.numero_indicador}</Card.Title>
                                            <Card.Text>{indicador.descricao_indicador}</Card.Text>
                                        </Card.Body>
                                        <Card.Footer className="d-flex justify-content-start">

                                            <Button variant="primary" size="sm" onClick={() => handleEdit(indicador)}>
                                                <GrEdit />
                                            </Button>
                                            <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(indicador.id_indicador)}>
                                                <RiDeleteBin6Line />
                                            </Button>
                                        </Card.Footer>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))
                    ) : (
                        <p>Nenhum indicador encontrado.</p>
                    )}
                </Row>

                {/* Modal de Adicionar Indicador */}
                <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Adicionar Novo Indicador</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleCreate}>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}>Número do Indicador</Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="number"
                                        name="numero_indicador"
                                        placeholder="Número"
                                        min="1"
                                        step="1"
                                        value={novoNumeroIndicador}
                                        onChange={(e) => setNovoNumeroIndicador(e.target.value)}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}>Descrição</Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="text"
                                        name="descricao_indicador"
                                        placeholder="Descrição do Indicador"
                                        value={novaDescricaoIndicador}
                                        onChange={(e) => setNovaDescricaoIndicador(e.target.value)}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Modal.Footer>
                                <Button variant="dark" type="submit">
                                    Cadastrar
                                </Button>
                                <Button variant="secondary" onClick={() => setShowModalAdd(false)}>
                                    Cancelar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Modal de Editar Indicador */}
                <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Indicador</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleUpdate}>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}>Número do Indicador</Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={numeroIndicador}
                                        onChange={(e) => setNumeroIndicador(e.target.value)}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}>Descrição</Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="text"
                                        value={descricaoIndicador}
                                        onChange={(e) => setDescricaoIndicador(e.target.value)}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Modal.Footer>
                                <Button variant="dark" type="submit">
                                    Salvar
                                </Button>
                                <Button variant="secondary" onClick={() => setShowModalEdit(false)}>
                                    Cancelar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal.Body>
                </Modal>

            </Container>
        </motion.div>
    );
};

export default ListarIndicadores;
