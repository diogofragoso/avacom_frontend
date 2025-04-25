import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import indicadorService from '../../services/indicadorService';
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import ListarUcs from '../ListarUcs';

const ListarIndicadores = ({ indicador, feedback, setFeedback, onDeleteSuccess, onEditSuccess }) => {
    const [editaIndicador, setEditarIndicador] = useState(null);
    const [numeroIndicador, setNumeroIndicador] = useState('');
    const [descricaoIndicador, setDescricaoIndicador] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Função para excluir o indicador
    const handleDeleteIndicador = async (id_indicador) => {
        if (window.confirm('Tem certeza que deseja excluir este indicador?')) {        
            try {
                await indicadorService.deleteIndicador(id_indicador);
                setFeedback({ type: 'success', message: 'Indicador excluído com sucesso!' });
                onDeleteSuccess(); // Atualiza a lista no componente pai
            } catch (error) {
                console.error(error);
                setFeedback({ type: 'danger', message: 'Erro ao excluir o Indicador.' });
            }
        }
    };

    // Função para iniciar a edição de uma UC
    const handleEdit = (id_indicador) => {
        setEditarIndicador(id_indicador);  // Marca qual Indicador está sendo editado
        setNumeroIndicador(indicador.numero_indicador);
        setDescricaoIndicador(indicador.descricao_indicador);       
        setShowModal(true);  // Exibe o modal de edição
    };

    // Função para enviar os dados editados para o servidor
    const handleUpdateUc = async () => {
        console.log("Dados enviados para update:", {
            nome_uc: nomeUc,
            numero_uc: numeroUc
        });
    
        try {
            const response = await ucService.updateUc(editingUc.id_uc, { 
                nome_uc: nomeUc, 
                numero_uc: numeroUc 
            });
    
            console.log("Resposta da API:", response);
    
            setFeedback({ type: 'success', message: 'UC editada com sucesso!' });
            onEditSuccess(); // Atualiza a lista no componente pai
            setShowModal(false); // Fecha o modal após salvar
        } catch (error) {
            console.error("Erro ao editar UC:", error);
            console.error("Detalhes do erro:", error.response?.data || error.message);
    
            const msg = error.response?.data?.error || 'Erro ao editar a UC.';
            setFeedback({ type: 'danger', message: msg });
        }
    };

    // Fechar o modal sem salvar
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Unidades Curriculares</h2>

            <Row>
                {ucs.map((uc) => (
                    <Col key={uc.id_uc} md={4} className="mb-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card style={{ width: '18rem' }}>
                                <Card.Body>
                                    <Card.Title>{uc.nome_uc}</Card.Title>
                                    <Card.Text>UC: {uc.numero_uc}</Card.Text>
                                    
                                    <Button 
                                        variant="primary" 
                                        size="sm" 
                                        title="Editar UC" 
                                        onClick={() => handleEdit(uc)}  // Inicia a edição ao clicar no ícone
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
                                </Card.Body>
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

export default ListarIndicadores;
