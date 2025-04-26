import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import indicadorService from '../../services/indicadorService'; // serviço que busca/exclui/edita indicadores
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";

const ListarIndicadores = () => {
    const [indicadores, setIndicadores] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [indicadorSelecionado, setIndicadorSelecionado] = useState(null);
    const [numeroIndicador, setNumeroIndicador] = useState('');
    const [descricaoIndicador, setDescricaoIndicador] = useState('');

    // Buscar todos os indicadores quando a página carrega
    useEffect(() => {
        buscarIndicadores();
    }, []);

    const buscarIndicadores = async () => {
        try {
            const response = await indicadorService.getAllIndicadores();
            setIndicadores(response.data);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        }
    };

    const handleDelete = async (id_indicador) => {
        if (window.confirm('Tem certeza que deseja excluir este indicador?')) {
            try {
                await indicadorService.deleteIndicador(id_indicador);
                buscarIndicadores(); // Atualiza a lista
            } catch (error) {
                console.error('Erro ao excluir indicador:', error);
            }
        }
    };

    const handleEdit = (indicador) => {
        setIndicadorSelecionado(indicador);
        setNumeroIndicador(indicador.numero_indicador);
        setDescricaoIndicador(indicador.descricao_indicador);
        setShowModal(true);
    };

    const handleUpdate = async () => {
        try {
            await indicadorService.updateIndicador(indicadorSelecionado.id_indicador, {
                numero_indicador: numeroIndicador,
                descricao_indicador: descricaoIndicador
            });
            buscarIndicadores();
            setShowModal(false);
        } catch (error) {
            console.error('Erro ao atualizar indicador:', error);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Indicadores</h2>
            <Row>
                {indicadores.map((indicador) => (
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
                                    <Button variant="primary" size="sm" onClick={() => handleEdit(indicador)}>
                                        <GrEdit />
                                    </Button>
                                    <Button variant="danger" size="sm" className="ms-2" onClick={() => handleDelete(indicador.id_indicador)}>
                                        <RiDeleteBin6Line />
                                    </Button>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            {/* Modal de edição */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Indicador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Número do Indicador</Form.Label>
                            <Form.Control
                                type="text"
                                value={numeroIndicador}
                                onChange={(e) => setNumeroIndicador(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Descrição do Indicador</Form.Label>
                            <Form.Control
                                type="text"
                                value={descricaoIndicador}
                                onChange={(e) => setDescricaoIndicador(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ListarIndicadores;
