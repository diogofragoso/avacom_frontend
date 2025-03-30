import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, FormGroup, FormLabel, FormControl, Alert,Card } from 'react-bootstrap'; // Adicionado Alert para feedback
import estudanteService from '../../services/estudanteService';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactLogo from '../../assets/react.svg';

const RegistrarUc = () => {
  const [formData, setFormData] = useState({
    nome_uc: '',
    id_curso_fk: ''
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
      setFeedback({ type: 'Sucesso', message: 'UC inserida com sucesso!' });
      setFormData({ nome_curso: '', descricao_curso: '' }); // Limpa o formulário após o cadastro
    } catch (error) {
      console.error('Erro ao cadastrar uc:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar uc: ' + error.message });
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Cadastro de UC</h2>

      {/* Feedback para o usuário */}
      {feedback.message && (
        <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible>
          {feedback.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup as={Row} className="mb-3">    


          <FormLabel column sm={2}>
            Unidade Curricular
          </FormLabel>
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



        {/* Pensei em inserir cards para representar os cursos */}
        <FormGroup as={Row} className="mb-3">
          <FormLabel column sm={2}>
            Nome do Curso
          </FormLabel>
          <Col sm={10}>
            <FormControl
              list='cursos'
              placeholder='Selecione o curso'
              name="id_curso_fk"
              type="text"
              value={formData.id_curso_fk}
              onChange={handleChange}
              required
            />
            <datalist id='cursos'>
              <option value='Técnico em redes' />
              <option value='Técnico em informática' />
              <option value='3' />
              <option value='4' />
            </datalist>

          </Col>
        </FormGroup>

        {/* Pensei em inserir cards para representar os cursos */}
          <FormGroup as={Row} className="mb-3">
            <FormLabel column sm={2}>
              <Card style={{ width: '12rem' }}>
                <Card.Img variant="top" src={ReactLogo} alt="React Logo" />
                <Card.Body>
                  <Card.Title>Técnico em Redes</Card.Title>
                  <Card.Text>
                    Adicione uma descrição breve sobre o curso aqui.
                  </Card.Text>
                </Card.Body>
              </Card>
            </FormLabel>
          {/* Pensei em inserir cards para representar os cursos */}
       
            <FormLabel column sm={2}>
              <Card style={{ width: '12rem' }}>
                <Card.Img variant="top" src={ReactLogo} alt="React Logo" />
                <Card.Body>
                  <Card.Title>Técnico em infor.</Card.Title>
                  <Card.Text>
                    Adicione uma descrição breve sobre o curso aqui.
                  </Card.Text>
                </Card.Body>
              </Card>
            </FormLabel>
          </FormGroup>
         









        <Button variant="dark" type="submit">
          Cadastrar2
        </Button>
      </Form>
    </Container>
  );
};

export default RegistrarUc;