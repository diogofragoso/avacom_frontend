import React from 'react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ucService from '../../services/ucService';

const ListarUcs = ({ ucs, feedback, setFeedback, onDeleteSuccess }) => {
    const handleDelete = async (id_uc) => {
        if (window.confirm('Tem certeza que deseja excluir esta UC?')) {
            try {
                await ucService.deleteUc(id_uc);
                setFeedback({ type: 'success', message: 'UC excluída com sucesso!' });
                onDeleteSuccess(); // Atualiza a lista no componente pai
            } catch (error) {
                console.error(error);
                setFeedback({ type: 'danger', message: 'Erro ao excluir a UC.' });
            }
        }
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
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(uc.id_uc)}
                                    >
                                        Excluir
                                    </Button>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ListarUcs;
