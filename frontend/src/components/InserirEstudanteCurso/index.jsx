import React, { useState } from 'react';
import {
  Container, Form, Button, Row, Col, FormGroup, FormLabel, FormControl, Alert, Modal
} from 'react-bootstrap';
import estudanteService from '../../services/estudanteService';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './InserirEstudanteCurso.module.css';
import { MdAddCircle } from "react-icons/md";


const InserirEstudanteCurso = () => {
  const [formData, setFormData] = useState({
    nome_aluno: '',
    email_aluno: '',
    senha_aluno: ''
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await estudanteService.createStudent(formData);
      setFeedback({ type: 'success', message: 'Estudante inserido com sucesso!' });
      setFormData({ nome_aluno: '', email_aluno: '', senha_aluno: '' });
      setShowModal(false); // Fecha o modal ao cadastrar
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar aluno: ' + error.message });
    }
  };

  return (
    <Container fluid className={`${styles.InserirEstudanteCurso} mt-4`}>
      <h2>Cadastro de estudantes</h2>

      {feedback.message && (
        <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible>
          {feedback.message}
        </Alert>
      )}

      {/* Botão para abrir o modal */}
      <Button variant="dark" onClick={() => setShowModal(true)}>
        Inserir Aluno<MdAddCircle size={30} className="ms-2" />
      </Button>

      
















      {/* Modal de cadastro */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar estudante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <FormLabel>Nome</FormLabel>
              <FormControl
                type="text"
                name="nome_aluno"
                placeholder="Digite o nome do aluno"
                value={formData.nome_aluno}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <FormLabel>Email</FormLabel>
              <FormControl
                type="email"
                name="email_aluno"
                placeholder="Digite o email do aluno"
                value={formData.email_aluno}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <FormLabel>Senha</FormLabel>
              <FormControl
                type="password"
                name="senha_aluno"
                placeholder="Digite uma senha"
                value={formData.senha_aluno}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <Button variant="success" type="submit">
              Cadastrar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default InserirEstudanteCurso;
