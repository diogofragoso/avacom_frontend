import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import cursoService from '../../services/cursoService';
import CursoCard from '../../components/CursoCard';


const EditarCurso = () => {
  const [cursos, setCursos] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await cursoService.getCursos(); // aqui recebe o array já direto
        setCursos(data); // usa direto
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        setFeedback({ type: 'danger', message: 'Erro ao buscar cursos: ' + error.message });
      }
    };
  
    fetchCursos();
  }, []);
  return (
    <Container className="mt-5">
      <h2 className="mb-4">Cursos Disponíveis</h2>

      {feedback.message && (
        <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible>
          {feedback.message}
        </Alert>
      )}

      <Row>
        {cursos.map((curso) => (
          <Col key={curso.id_curso} md={4} className="mb-4">
            <CursoCard titulo={curso.nome_curso} descricao={curso.descricao_curso} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default EditarCurso;
