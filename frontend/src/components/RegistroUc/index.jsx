import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap';
import ucService from '../../services/ucService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import {motion} from 'framer-motion';
import ListarUcs from '../../components/ListarUcs';
import { Spinner } from 'react-bootstrap';


const RegistrarUc = () => {
  

  
  const location = useLocation();
  const { nome_curso, id_curso } = location.state.curso;
  const [loading, setLoading] = useState(true);


  const [formData, setFormData] = useState({
    nome_uc: '',
    numero_uc: '',
    id_curso_fk: id_curso,
  });

  const [ucs, setUcs] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

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

  // Carregar UCs ao carregar o componente
  useEffect(() => {
   carregarUcs();      
  }, [id_curso]);

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
      await carregarUcs(); // Atualiza a lista após o cadastro

      // Atualiza a lista após o cadastro
      // const data = await ucService.getUcs();
      // const filtradas = data.filter((uc) => uc.id_curso_fk === id_curso);
      // setUcs(filtradas);

    } catch (error) {
      console.error('Erro ao cadastrar UC:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar UC: ' + error.message });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
    <Container className="mt-5">
      <h2 className="mb-4">Cadastro de UCs - {nome_curso}</h2>

      {feedback.message && (
        <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible>
          {feedback.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup as={Row} className="mb-3">
          <FormLabel column sm={2}>Unidade Curricular</FormLabel>
          <Col sm={10}>
            <FormControl
              type="text"
              name="nome_uc"
              placeholder="Nome da UC"
              value={formData.nome_uc}
              onChange={handleChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
          <FormLabel column sm={2}>Número da UC</FormLabel>
          <Col sm={10}>
            <FormControl
              type="number"
              name="numero_uc"
              placeholder="Defina o número da UC"
              value={formData.numero_uc}
              onChange={handleChange}
              min="1"
              required
            />
          </Col>
        </FormGroup>

        <Button variant="dark" type="submit">Cadastrar</Button>
      </Form>


      {loading ? (
        <div className="d-flex justify-content-center mt-5">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : (
        <></>
      )}
      <ListarUcs 
      ucs={ucs} feedback={feedback} 
      setFeedback={setFeedback} 
      onDeleteSuccess={carregarUcs} 
      onEditSuccess={carregarUcs}/>


    </Container>
  </motion.div>
  );
};

export default RegistrarUc;
