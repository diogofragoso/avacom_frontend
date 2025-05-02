import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal, Alert, Spinner } from 'react-bootstrap';
import cursoService from '../../services/cursoService';
import { motion } from 'framer-motion';
import ListarCursos from '../../components/EditarCurso'; // Vamos precisar criar esse componente
import 'bootstrap/dist/css/bootstrap.min.css';

const RegistrarCurso = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [formData, setFormData] = useState({
    nome_curso: '',
    descricao_curso: ''
  });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const carregarCursos = async () => {
    try {
      setLoading(true);
      const data = await cursoService.getCursos(); // Certifique-se que esse método existe em cursoService
      setCursos(data);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      setFeedback({ type: 'danger', message: 'Erro ao buscar cursos: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCursos();
  }, []);

  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ type: '', message: '' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cursoService.createCurso(formData);
      setFeedback({ type: 'success', message: 'Curso inserido com sucesso!' });
      setFormData({ nome_curso: '', descricao_curso: '' });
      setShowModalAdd(false);
      await carregarCursos(); // <-- Atualiza a lista puxando do servidor
    } catch (error) {
      console.error('Erro ao cadastrar curso:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar curso: ' + error.message });
    }
  };
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container fluid className="mt-5 position-relative">

        <h2 className="mb-4">Cadastro de Cursos</h2>

        <Button variant="dark" className="mb-4" onClick={() => setShowModalAdd(true)}>
          Adicionar Novo Curso
        </Button>

        {/* Modal */}
        <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Novo Curso</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>Nome do Curso</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="nome_curso"
                    placeholder="Nome do curso"
                    value={formData.nome_curso}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>Descrição</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="descricao_curso"
                    placeholder="Breve descrição do curso"
                    value={formData.descricao_curso}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              <Modal.Footer>
                <Button variant="primary" type="submit">
                  Cadastrar
                </Button>
                <Button variant="secondary" onClick={() => setShowModalAdd(false)}>
                  Cancelar
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Feedback sobreposto */}
        <div className="position-relative">
          {feedback.message && (
            <div style={{
              position: 'absolute',
              top: '-20px',
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

          {/* Lista de cursos */}
          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <Spinner animation="border" variant="dark" />
            </div>
          ) : (
            <ListarCursos
              cursos={cursos}
              feedback={feedback}
              setFeedback={setFeedback}
              onDeleteSuccess={carregarCursos}
              onEditSuccess={carregarCursos}
            />
          )}
        </div>

      </Container>
    </motion.div>
  );
};

export default RegistrarCurso;
