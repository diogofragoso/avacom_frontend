import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, FormGroup, FormLabel, FormControl, Alert,Card } from 'react-bootstrap'; // Adicionado Alert para feedback
import ucService from '../../services/ucService'; //importando o serviço UcService
import 'bootstrap/dist/css/bootstrap.min.css';
import ListarUcs from '../../components/ListarUcs'; // Importando o componente ListarUcs
import { useLocation } from 'react-router-dom';

const RegistrarUc = () => {
  const location = useLocation(); // Obtemos a localização atual
  const { nome_curso, id_curso } = location.state.curso; // Extraímos o nome do curso e o id_curso_fk do estado passado

  const [formData, setFormData] = useState({
    nome_uc: '',
    numero_uc: '',
   // id_curso_fk : id_curso_fk, // id_curso_fk deve ser passado como prop
    id_curso_fk : id_curso, // id_curso_fk deve ser passado como prop
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' }); // Estado para feedback

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ucService.createUcs(formData);
      console.log("Enviando dados para o servidor:", formData); // Log dos dados enviados
      

      setFeedback({ type: 'success', message: 'UC inserida com sucesso!' });
      setFormData({ nome_curso: '', descricao_curso: '', id_curso_fk: id_curso }); // Limpa o formulário após o cadastro
    } catch (error) {
      console.error('Erro ao cadastrar uc:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar uc: ' + error.message });
    }
  };

  

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Cadastro de UCs  -  {nome_curso} </h2>

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
            Número da UC
          </FormLabel>
          <Col sm={10}>
            <FormControl              
              placeholder='Defina o número da UC'
              name="numero_uc"
              type="number"
              min="1"
              value={formData.numero_uc}
              onChange={handleChange}
              required
            />
           

          </Col>
        </FormGroup>     
         

        <Button variant="dark" type="submit">
          Cadastrar
        </Button>
      </Form>

       <ListarUcs id_curso={id_curso} /> {/* Passando o id_curso para o componente ListarUcs */}


    </Container>
  );
};

export default RegistrarUc;