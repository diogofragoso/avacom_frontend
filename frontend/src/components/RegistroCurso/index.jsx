import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap'; // Adicionado Alert para feedback
import estudanteService from '../../services/estudanteService';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegistroCurso = () => {
  const [formData, setFormData] = useState({
    nome_curso: '',
    descricao_curso: ''
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' }); // Estado para feedback

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await estudanteService.createStudent(formData);
      setFeedback({ type: 'Sucesso', message: 'Curso inserido com sucesso!' });
      setFormData({ nome_curso: '', descricao_curso: '' }); // Limpa o formulário após o cadastro
    } catch (error) {
      console.error('Erro ao cadastrar o curso:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar o curso: ' + error.message });
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Cadastro de curso</h2>

      {/* Feedback para o usuário */}
      {feedback.message && (
        <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible>
          {feedback.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup as={Row} className="mb-3">
          <FormLabel column sm={2}>
            Nome
          </FormLabel>
          <Col sm={10}>
            <FormControl
              type="text"
              name="nome_curso"
              placeholder="Digite o nome do curso"
              value={formData.nome_curso}
              onChange={handleChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
          <FormLabel column sm={2}>
            Descrição
          </FormLabel>
          <Col sm={10}>
            <FormControl
              type="text"
              name="descricao_curso"
              placeholder="Breve descrição do curso"
              value={formData.descricao_curso}
              onChange={handleChange}
              required
            />
          </Col>
        </FormGroup>
      

        <Button variant="dark" type="submit">
          Cadastrar
        </Button>
      </Form>
    </Container>
  );
};

export default RegistroCurso;
