import React, { useEffect, useState } from "react";
import { Modal, Button, Form, InputGroup, Spinner, Table } from "react-bootstrap";
import estudanteService from "../../services/estudanteService"; 
import matriculaService from "../../services/matriculaService";
import { FaSearch } from "react-icons/fa";

function ModalMatricularAluno({ show, handleClose, turmaId, onMatriculaRealizada }) {
  const [alunos, setAlunos] = useState([]);
  const [matriculados, setMatriculados] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);

  // 1. Ao abrir o modal, carrega matriculados
  useEffect(() => {
    if (show) {
      carregarMatriculados();
    }
  }, [show]);

  // 2. Sempre que o filtro mudar, refaz a lista de alunos disponíveis
  useEffect(() => {
    if (matriculados.length >= 0) {
      carregarAlunos(filtro);
    }
  }, [filtro, matriculados]);

  const carregarMatriculados = async () => {
    try {
      const lista = await matriculaService.getAlunosMatriculadosPorTurma(turmaId);
      setMatriculados(lista);
    } catch (error) {
      console.error("Erro ao carregar alunos matriculados", error);
    }
  };

  const carregarAlunos = async (nomeFiltro) => {
    setCarregando(true);
    try {
      const lista = await estudanteService.listarEstudantes();

      // Filtra pelo nome
      const filtrados = nomeFiltro
        ? lista.filter((aluno) =>
            aluno.nome_aluno.toLowerCase().startsWith(nomeFiltro.toLowerCase())
          )
        : lista;

      // Remove alunos já matriculados
      const disponiveis = filtrados.filter(
        (aluno) => !matriculados.some((m) => m.id_aluno === aluno.id_aluno)
      );

      setAlunos(disponiveis);
    } catch (error) {
      console.error("Erro ao carregar alunos", error);
    } finally {
      setCarregando(false);
    }
  };

  const confirmarMatricula = async () => {
    if (!alunoSelecionado) return;

    try {
      await matriculaService.criarMatricula({
        id_aluno_fk: alunoSelecionado.id_aluno,
        id_turma_fk: turmaId,
      });

      onMatriculaRealizada();
      handleClose();
    } catch (error) {
      console.error("Erro ao matricular aluno", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Matricular Aluno</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Pesquisar aluno por nome..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </InputGroup>

        {carregando ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {alunos.length > 0 ? (
                alunos.map((aluno) => (
                  <tr key={aluno.id_aluno}>
                    <td>{aluno.nome_aluno}</td>
                    <td>{aluno.email_aluno}</td>
                    <td>
                      <Button
                        variant={
                          alunoSelecionado?.id_aluno === aluno.id_aluno
                            ? "success"
                            : "outline-primary"
                        }
                        size="sm"
                        onClick={() => setAlunoSelecionado(aluno)}
                      >
                        {alunoSelecionado?.id_aluno === aluno.id_aluno
                          ? "Selecionado"
                          : "Selecionar"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={confirmarMatricula}
          disabled={!alunoSelecionado}
        >
          Confirmar Matrícula
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalMatricularAluno;
