import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { NavLink as NavLink2 } from 'react-router-dom';
import CursoCard from '../../components/CursoCard';

const EditarCurso = ({ cursos }) => {
  return (
    <Container className="mt-5">
      <h2 className="mb-4">Cursos Disponíveis</h2>

      {cursos.length > 0 ? (
        <Row>
          {cursos.map((curso) => (
            <Col key={curso.id_curso} md={4} className="mb-4">
              <NavLink2
                to="/Home/PainelUc/RegistroUc"
                state={{ curso }}
                className="text-decoration-none"
              >
                <CursoCard
                  titulo={curso.nome_curso}
                  descricao={curso.descricao_curso}
                />
              </NavLink2>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          Nenhum curso disponível no momento.
        </Alert>
      )}
    </Container>
  );
};

export default EditarCurso;
