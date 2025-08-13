// components/ModalMatricularAluno.js
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import matriculaService from '../../services/matriculaService';

function ModalMatricularAluno({ show, handleClose, turmaId, cursoId, onMatriculaRealizada }) {
  const [alunosDisponiveis, setAlunosDisponiveis] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (show) {
      setCarregando(true);
      setErro('');
      matriculaService
        .listarAlunosPorCurso(cursoId)
        .then(setAlunosDisponiveis)
        .catch(() => setErro('Erro ao carregar alunos'))
        .finally(() => setCarregando(false));
    }
  }, [show, cursoId]);

  const handleMatricular = async () => {
    if (!alunoSelecionado) return;

    try {
      await matriculaService.matricularAluno({
        id_aluno_fk: alunoSelecionado,
        id_curso_fk: cursoId,
        id_turma_fk: turmaId,
      });

      onMatriculaRealizada(); // Atualiza lista principal
      handleClose(); // Fecha modal
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Matricular Aluno</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {carregando && <Spinner animation="border" />}
        {erro && <Alert variant="danger">{erro}</Alert>}

        <Form>
          <Form.Group>
            <Form.Label>Selecione um aluno</Form.Label>
            <Form.Select
              value={alunoSelecionado}
              onChange={(e) => setAlunoSelecionado(e.target.value)}
            >
              <option value="">-- Escolha um aluno --</option>
              {alunosDisponiveis.map((aluno) => (
                <option key={aluno.id_aluno} value={aluno.id_aluno}>
                  {aluno.nome_aluno}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleMatricular} disabled={!alunoSelecionado}>
          Matricular
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalMatricularAluno;
