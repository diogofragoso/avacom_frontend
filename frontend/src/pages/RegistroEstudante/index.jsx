import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap'; // Adicionado Alert para feedback
import estudanteService from '../../services/estudanteService';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegistroEstudante = () => {
  const [formData, setFormData] = useState({
    nome_aluno: '',
    email_aluno: '',
    senha_aluno: ''
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
      setFeedback({ type: 'success', message: 'Estudante inserido com sucesso!' });
      setFormData({ nome_aluno: '', email_aluno: '', senha_aluno: '' }); // Limpa o formulário após o cadastro
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar aluno: ' + error.message });
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Cadastro de estudantes</h2>

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
              name="nome_aluno"
              placeholder="Digite o nome do aluno"
              value={formData.nome_aluno}
              onChange={handleChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
          <FormLabel column sm={2}>
            Email
          </FormLabel>
          <Col sm={10}>
            <FormControl
              type="email"
              name="email_aluno"
              placeholder="Digite o email do aluno"
              value={formData.email_aluno}
              onChange={handleChange}
              required
            />
          </Col>
        </FormGroup>

        <FormGroup as={Row} className="mb-3">
          <FormLabel column sm={2}>
            Senha
          </FormLabel>
          <Col sm={10}>
            <FormControl
              type="password"
              name="senha_aluno"
              placeholder="Digite uma senha"
              value={formData.senha_aluno}
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

export default RegistroEstudante;