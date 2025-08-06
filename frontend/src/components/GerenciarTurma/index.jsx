import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Table, Spinner, Alert } from 'react-bootstrap';
import matriculaService from '../../services/matriculaService';

function GerenciarTurma() {
  const location = useLocation();
  const navigate = useNavigate();
  const { turma } = location.state || {};

  const [estudantes, setEstudantes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarEstudantes = async () => {
      try {
        const alunos = await matriculaService.getAlunosMatriculados(turma.id_turma);
        setEstudantes(alunos);
      } catch (err) {
        setErro('Erro ao buscar estudantes.');
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };

    if (turma?.id_turma) {
      carregarEstudantes();
    }
  }, [turma]);

  if (!turma) {
    return (
      <Container className="mt-4">
        <p>Turma não encontrada. Retorne e selecione uma turma.</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>
          <h4>Gerenciamento da Turma: {turma.nome_turma}</h4>
        </Card.Header>
        <Card.Body>
          <p><strong>Curso:</strong> {turma.nome_curso}</p>
          <p><strong>Período:</strong> {turma.periodo_turma}</p>
          <p><strong>Data de Início:</strong> {turma.data_inicio_turma}</p>
          <p><strong>Máx. de Alunos:</strong> {turma.max_aluno_turma}</p>

          <hr />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5>Estudantes matriculados</h5>
            <Button variant="primary" onClick={() => alert('Ação de adicionar estudante aqui')}>
              + Adicionar Estudante
            </Button>
          </div>

          {carregando && <Spinner animation="border" />}
          {erro && <Alert variant="danger">{erro}</Alert>}

          {!carregando && estudantes.length === 0 && (
            <p>Nenhum estudante matriculado ainda.</p>
          )}

          {estudantes.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {estudantes.map((estudante, index) => (
                  <tr key={index}>
                    <td>{estudante.nome_estudante}</td>
                    <td>{estudante.cpf_estudante}</td>
                    <td>{estudante.email_estudante}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          <Button variant="secondary" className="mt-3" onClick={() => navigate(-1)}>
            Voltar para Turmas
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default GerenciarTurma;
