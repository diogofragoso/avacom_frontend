import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

const atividades = [
  { id: 1, descricao: 'Apresentação do Projeto Final', id_fk_uc: 10 },
  { id: 2, descricao: 'Relatório de Pesquisa de Campo', id_fk_uc: 10 },
  { id: 3, descricao: 'Prova Teórica', id_fk_uc: 11 },
];

export default function CardAvaliativa() {
  return (
    <div className="p-4">
      <h1 className="mb-4">Atividades Avaliativas</h1>

      <Row xs={1} md={2} lg={3} className="g-4">
        {atividades.map((atividade) => (
          <Col key={atividade.id}>
            <Card className="h-100 shadow-sm border-0 rounded-4">
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title className="fw-bold">ID: {atividade.id}</Card.Title>
                  <Card.Text className="text-muted">{atividade.descricao}</Card.Text>
                  <Card.Text className="text-secondary small">ID UC: {atividade.id_fk_uc}</Card.Text>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <Button variant="dark" size="sm" className="me-2">
                    Editar
                  </Button>
                  <Button variant="danger" size="sm">
                    Excluir
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Card para adicionar nova atividade */}
        <Col>
          <Card className="h-100 border-2 border-dashed rounded-4 text-center p-4 d-flex justify-content-center align-items-center shadow-sm" style={{ cursor: 'pointer' }}>
            <Card.Body>
              <h5 className="text-primary">+ Nova Atividade</h5>
              <p className="text-muted small">Clique aqui para adicionar</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

