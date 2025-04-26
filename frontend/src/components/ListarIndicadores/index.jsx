import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import indicadorService from '../../services/indicadorService';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";

const ListarIndicadores = ({ id_uc }) => {
    const [indicadores, setIndicadores] = useState([]);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false); // <<< Modal para adicionar
    const [indicadorSelecionado, setIndicadorSelecionado] = useState(null);
    const [numeroIndicador, setNumeroIndicador] = useState('');
    const [descricaoIndicador, setDescricaoIndicador] = useState('');

    const [novoNumeroIndicador, setNovoNumeroIndicador] = useState(''); // <<< Campos novos
    const [novaDescricaoIndicador, setNovaDescricaoIndicador] = useState('');

    useEffect(() => {
        if (id_uc) {
            buscarIndicadores();
        }
    }, [id_uc]);

    const buscarIndicadores = async () => {
        try {
            const response = await indicadorService.getIndicadoresPorUc(id_uc);
            setIndicadores(response);
        } catch (error) {
            console.error('Erro ao buscar indicadores:', error);
        }
    };

    const handleDelete = async (id_indicador) => {
        if (window.confirm('Tem certeza que deseja excluir este indicador?')) {
            try {
                await indicadorService.deleteIndicador(id_indicador);
                buscarIndicadores();
            } catch (error) {
                console.error('Erro ao excluir indicador:', error);
            }
        }
    };

    const handleEdit = (indicador) => {
        setIndicadorSelecionado(indicador);
        setNumeroIndicador(indicador.numero_indicador);
        setDescricaoIndicador(indicador.descricao_indicador);
        setShowModalEdit(true);
    };

    const handleUpdate = async () => {
        try {
            await indicadorService.updateIndicador(indicadorSelecionado.id_indicador, {
                numero_indicador: numeroIndicador,
                descricao_indicador: descricaoIndicador
            });
            buscarIndicadores();
            setShowModalEdit(false);
        } catch (error) {
            console.error('Erro ao atualizar indicador:', error);
        }
    };

    const handleCreate = async () => {
        try {
            await indicadorService.createIndicador({
                numero_indicador: novoNumeroIndicador,
                descricao_indicador: novaDescricaoIndicador,
                id_uc_fk: id_uc // <<< Muito importante associar à UC!
            });
            buscarIndicadores();
            setShowModalAdd(false);
            setNovoNumeroIndicador('');
            setNovaDescricaoIndicador('');
        } catch (error) {
            console.error('Erro ao criar indicador:', error);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Indicadores</h2>

            {/* Botão de adicionar */}
            <Button className="mb-4" onClick={() => setShowModalAdd(true)}>Adicionar Indicador</Button>

            <Row>
                {indicadores.length > 0 ? (
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
                    ))
                ) : (
                    <p>Nenhum indicador encontrado.</p>
                )}
            </Row>

            {/* Modal de edição */}
            <Modal show={showModalEdit} onHide={() => setShowModalEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Indicador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Número do Indicador</Form.Label>
                            <Form.Control
                                type="text"
                                value={numeroIndicador}
                                onChange={(e) => setNumeroIndicador(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
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
                    <Button variant="secondary" onClick={() => setShowModalEdit(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleUpdate}>Salvar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de adicionar novo */}
            <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Novo Indicador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Número do Indicador</Form.Label>
                            <Form.Control
                            
                                type='number' 
                                step="1" // Para garantir que seja um número inteiro
                                min="1"// Para garantir que seja um número positivo
                                placeholder="Digite o número do indicador"
                                value={novoNumeroIndicador}
                                onChange={(e) => setNovoNumeroIndicador(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição do Indicador</Form.Label>
                            <Form.Control
                                type="text"
                                value={novaDescricaoIndicador}
                                onChange={(e) => setNovaDescricaoIndicador(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalAdd(false)}>Cancelar</Button>
                    <Button variant="success" onClick={handleCreate}>Adicionar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ListarIndicadores;
