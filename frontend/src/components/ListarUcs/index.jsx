import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import ucService from '../../services/ucService';

const ListarUcs = ({ id_curso }) => {
  const [ucs, setUcs] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchUcs = async () => {
      try {
        const data = await ucService.getUcs();
        const filtradas = data.filter((uc) => uc.id_curso_fk === id_curso);
        setUcs(filtradas);
      } catch (error) {
        console.error('Erro ao buscar UCs:', error);
        setFeedback({ type: 'danger', message: 'Erro ao buscar UCs: ' + error.message });
      }
    };
    fetchUcs();
  }, [id_curso]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Unidades Curriculares do Curso</h2>

      {feedback.message && (
        <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible>
          {feedback.message}
        </Alert>
      )}

      <Row>
        {ucs.map((uc) => (
          <Col key={uc.id_uc} md={4} className="mb-4">       
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>{uc.nome_uc}</Card.Title>
                <Card.Text>Número: {uc.numero_uc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ListarUcs;
