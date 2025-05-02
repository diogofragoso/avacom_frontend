import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Modal, Alert, Spinner } from 'react-bootstrap';
import ucService from '../../services/ucService';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ListarUcs from '../../components/ListarUcs';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegistrarUc = () => {
  const location = useLocation();
  const { nome_curso, id_curso } = location.state.curso;

  const [loading, setLoading] = useState(true);
  const [showModalAdd, setShowModalAdd] = useState(false);

  const [formData, setFormData] = useState({
    nome_uc: '',
    numero_uc: '',
    id_curso_fk: id_curso,
  });

  const [ucs, setUcs] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', message: '' });


// apenas um teste
useEffect(() => {
  console.log(location.state);  // Verifique se o estado está correto
}, [location.state]);


// fim de teste


  const carregarUcs = async () => {
    try {
      setLoading(true);
      const data = await ucService.getUcs();
      const filtradas = data.filter((uc) => uc.id_curso_fk === id_curso);
      setUcs(filtradas);
    } catch (error) {
      console.error('Erro ao buscar UCs:', error);
      setFeedback({ type: 'danger', message: 'Erro ao buscar UCs: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUcs();
  }, [id_curso]);

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
      await ucService.createUcs(formData);
      setFeedback({ type: 'success', message: 'UC inserida com sucesso!' });
      setFormData({ nome_uc: '', numero_uc: '', id_curso_fk: id_curso });
      await carregarUcs();
      setShowModalAdd(false);
    } catch (error) {
      console.error('Erro ao cadastrar UC:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar UC: ' + error.message });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container fluid className="mt-5 position-relative">

        <h2 className="mb-4">Cadastro de UCs - {nome_curso}</h2>

        <Button variant="dark" className="mb-4" onClick={() => setShowModalAdd(true)}>
          Adicionar Nova UC
        </Button>

        {/* Modal */}
        <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Nova UC</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>Unidade Curricular</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="text"
                    name="nome_uc"
                    placeholder="Nome da UC"
                    value={formData.nome_uc}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={3}>Número da UC</Form.Label>
                <Col sm={9}>
                  <Form.Control
                    type="number"
                    name="numero_uc"
                    placeholder="Defina o número da UC"
                    value={formData.numero_uc}
                    onChange={handleChange}
                    min="1"
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

        {/* Área que vai conter o alerta sobreposto */}
        <div className="position-relative">
          {feedback.message && (
            <div style={{
              position: 'absolute',
              top: '-20px', // Sobe um pouquinho acima da lista
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

          {/* Lista de UCs */}
          {loading ? (
            <div className="d-flex justify-content-center mt-5">
              <Spinner animation="border" variant="dark" />
            </div>
          ) : (
            <ListarUcs
              ucs={ucs}
              feedback={feedback}
              setFeedback={setFeedback}
              onDeleteSuccess={carregarUcs}
              onEditSuccess={carregarUcs}
              curso={nome_curso}// Passando o nome do curso para o componente ListarUcs
            />
          )}
        </div>

      </Container>
    </motion.div>
  );
};

export default RegistrarUc;
