import { Card, Button, Badge, ProgressBar, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';
import styles from './ListarTurma.module.css';
import { useState, useEffect } from 'react';
import cursoService from '../../services/cursoService';
import { getTurmas, inserirTurma, editarTurma, deletarTurma } from '../../services/turmaService';

export default function ListarTurmas() {
  const [showModal, setShowModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [turmaEditando, setTurmaEditando] = useState(null);
  const [showModalMatricula, setShowModalMatricula] = useState(false);
  const [turmaParaMatricular, setTurmaParaMatricular] = useState(null);
  const [nomeAlunoMatricula, setNomeAlunoMatricula] = useState('');


  const [formData, setFormData] = useState({
    nome_turma: '',
    id_curso_fk: '',
    periodo_turma: 'Manhã',
    max_aluno_turma: '',
    data_inicio_turma: ''
  });

  const [cursos, setCursos] = useState([]);
  const [turmas, setTurmas] = useState([]);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [turmaParaDeletar, setTurmaParaDeletar] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    async function fetchCursos() {
      try {
        const data = await cursoService.getCursos();
        setCursos(data);
      } catch (error) {
        console.error('Erro ao carregar cursos:', error);
      }
    }
    fetchCursos();
  }, []);

  useEffect(() => {
    async function fetchTurmas() {
      try {
        const dados = await getTurmas();
        const turmasFormatadas = dados.map(t => ({
          id: t.id_turma,
          nome_turma: t.nome_turma,
          id_curso_fk: t.id_curso_fk,
          periodo_turma: t.periodo_turma,
          max_aluno_turma: t.max_aluno_turma,
          data_inicio_turma: new Date(t.data_inicio_turma).toISOString().split('T')[0], // yyyy-mm-dd
          ocupacaoAtual: 0,
          ocupacaoMax: t.max_aluno_turma
        }));
        setTurmas(turmasFormatadas);
      } catch (error) {
        console.error('Erro ao carregar turmas:', error);
      }
    }
    fetchTurmas();
  }, []);

  const handleShow = () => {
    setModoEdicao(false);
    setFormData({
      nome_turma: '',
      id_curso_fk: '',
      periodo_turma: 'Manhã',
      max_aluno_turma: '',
      data_inicio_turma: ''
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setModoEdicao(false);
    setTurmaEditando(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSalvar = async () => {
    const { nome_turma, id_curso_fk, periodo_turma, max_aluno_turma, data_inicio_turma } = formData;
    const maxAlunos = parseInt(max_aluno_turma, 10);
    const idCurso = parseInt(id_curso_fk, 10);

    if (!nome_turma.trim() || !id_curso_fk || !periodo_turma || !max_aluno_turma || !data_inicio_turma ||
      isNaN(maxAlunos) || maxAlunos <= 0 || isNaN(idCurso) || idCurso <= 0) {
      alert('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const turmaData = {
      nome_turma: nome_turma.trim(),
      periodo_turma,
      max_aluno_turma: maxAlunos,
      data_inicio_turma,
      id_curso_fk: idCurso
    };

    try {
      if (modoEdicao && turmaEditando) {
        await editarTurma(turmaEditando.id, turmaData);

        setTurmas(prev =>
          prev.map(t =>
            t.id === turmaEditando.id
              ? {
                ...t,
                ...turmaData,
                data_inicio_turma: turmaData.data_inicio_turma
              }
              : t
          )
        );
      } else {
        const nova = await inserirTurma(turmaData);

        setTurmas(prev => [
          ...prev,
          {
            id: nova.id_turma,
            ...turmaData,
            ocupacaoAtual: 0,
            ocupacaoMax: maxAlunos
          }
        ]);
      }

      handleClose();
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
      alert('Erro ao salvar turma.');
    }
  };

  const abrirModalMatricula = (turma) => {
    if (turma.ocupacaoAtual >= turma.ocupacaoMax) {
      // Turma lotada, não abre modal
      return;
    }
    setTurmaParaMatricular(turma);
    setNomeAlunoMatricula('');
    setShowModalMatricula(true);
  };
  
  const fecharModalMatricula = () => {
    setShowModalMatricula(false);
    setTurmaParaMatricular(null);
    setNomeAlunoMatricula('');
  };
  
  const handleMatricularAluno = () => {
    if (!nomeAlunoMatricula.trim()) {
      alert('Informe o nome do aluno para matricular');
      return;
    }
  
    // Aqui você pode implementar a chamada API para matricular o aluno, por enquanto só alert:
    alert(`Aluno "${nomeAlunoMatricula}" matriculado na turma "${turmaParaMatricular.nome_turma}"`);
  
    // Depois de matricular, fecha o modal
    fecharModalMatricula();
  
    // Opcional: atualizar ocupacaoAtual da turma no estado turmas
    setTurmas(prevTurmas =>
      prevTurmas.map(t =>
        t.id === turmaParaMatricular.id
          ? { ...t, ocupacaoAtual: t.ocupacaoAtual + 1 }
          : t
      )
    );
  };
  







  const abrirModalEditar = (turma) => {
    setFormData({
      nome_turma: turma.nome_turma,
      id_curso_fk: turma.id_curso_fk,
      periodo_turma: turma.periodo_turma,
      max_aluno_turma: turma.max_aluno_turma,
      data_inicio_turma: turma.data_inicio_turma
    });
    setModoEdicao(true);
    setTurmaEditando(turma);
    setShowModal(true);
  };

  const abrirModalConfirmarDelecao = (turma) => {
    setTurmaParaDeletar(turma);
    setShowConfirmDelete(true);
  };

  const fecharModalConfirmarDelecao = () => {
    setShowConfirmDelete(false);
    setTurmaParaDeletar(null);
  };

  const confirmarDelecao = async () => {
    if (!turmaParaDeletar) return;

    setLoadingDelete(true);
    try {
      await deletarTurma(turmaParaDeletar.id);
      setTurmas(prev => prev.filter(t => t.id !== turmaParaDeletar.id));
      fecharModalConfirmarDelecao();
    } catch (error) {
      console.error('Erro ao deletar turma:', error);
      alert('Erro ao deletar turma.');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <div className={`container mt-4 ${styles.containerCustom}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={styles.title}><FaChalkboardTeacher className="me-2" /> Gerenciar Turmas</h2>
        <Button variant="success" onClick={handleShow}>+ Nova Turma</Button>
      </div>

      <div className="row">
        {turmas.map((turma) => {
          const cursoObj = cursos.find(c => c.id_curso === turma.id_curso_fk);
          const nomeCurso = cursoObj ? cursoObj.nome_curso : 'Curso não informado';
          const ocupacaoPercentual = turma.ocupacaoMax > 0 ? (turma.ocupacaoAtual / turma.ocupacaoMax) * 100 : 0;

          return (
            <div key={turma.id} className="col-md-4 mb-4">
              <Card className={styles.card}>
                <Card.Body>
                  <Card.Title className={styles.cardTitle}>
                    {turma.nome_turma}
                    <div>
                      <FaUserPlus
                        className={`${styles.icon} text-info me-2`}
                        onClick={() => abrirModalMatricula(turma)}
                        style={{
                          cursor: turma.ocupacaoAtual >= turma.ocupacaoMax ? 'not-allowed' : 'pointer',
                          opacity: turma.ocupacaoAtual >= turma.ocupacaoMax ? 0.5 : 1
                        }}
                        title={turma.ocupacaoAtual >= turma.ocupacaoMax ? 'Turma lotada' : 'Matricular aluno'}
                      />

                      <FaEdit
                        className={`${styles.icon} text-success me-2`}
                        onClick={() => abrirModalEditar(turma)}
                        style={{ cursor: 'pointer' }}
                      />
                      <FaTrash
                        className={`${styles.icon} text-danger`}
                        onClick={() => abrirModalConfirmarDelecao(turma)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </Card.Title>
                  <Card.Subtitle className="mb-2">📘 {nomeCurso}</Card.Subtitle>
                  <div className="mb-2">
                    ⏰ <Badge bg={turma.periodo_turma === 'Manhã' ? 'warning' : 'secondary'} text="dark">
                      {turma.periodo_turma}
                    </Badge>
                    <span className="ms-2">📅 {new Date(turma.data_inicio_turma).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div>
                    Ocupação: <strong>{turma.ocupacaoAtual}/{turma.ocupacaoMax} alunos</strong>
                    <ProgressBar now={ocupacaoPercentual} className="mt-1" />
                  </div>






                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Modal Criar/Editar Turma */}
      <Modal show={showModal} onHide={handleClose} centered backdrop="static" contentClassName={styles.modalDark}>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicao ? 'Editar Turma' : 'Criar Nova Turma'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Turma *</Form.Label>
              <Form.Control
                type="text"
                name="nome_turma"
                value={formData.nome_turma}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Curso *</Form.Label>
              <Form.Select
                name="id_curso_fk"
                value={formData.id_curso_fk}
                onChange={handleChange}
              >
                <option value="">Selecione um curso</option>
                {cursos.map((curso) => (
                  <option key={curso.id_curso} value={curso.id_curso}>{curso.nome_curso}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Período *</Form.Label>
              <Form.Select
                name="periodo_turma"
                value={formData.periodo_turma}
                onChange={handleChange}
              >
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Data de Início *</Form.Label>
              <Form.Control
                type="date"
                name="data_inicio_turma"
                value={formData.data_inicio_turma}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Máximo de Alunos *</Form.Label>
              <Form.Control
                type="number"
                name="max_aluno_turma"
                value={formData.max_aluno_turma}
                onChange={handleChange}
                min="1"
                max="40"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="success" onClick={handleSalvar}>
            {modoEdicao ? 'Salvar Alterações' : 'Criar Turma'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmar Deleção */}
      <Modal show={showConfirmDelete} onHide={fecharModalConfirmarDelecao} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Confirmar deleção</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {turmaParaDeletar && (
            <p>Tem certeza que deseja deletar a turma <strong>{turmaParaDeletar.nome_turma}</strong>?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={fecharModalConfirmarDelecao} disabled={loadingDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarDelecao} disabled={loadingDelete}>
            {loadingDelete ? 'Deletando...' : 'Deletar'}
          </Button>
        </Modal.Footer>
      </Modal>

{/* Modal Matricula */}
<Modal show={showModalMatricula} onHide={fecharModalMatricula} centered backdrop="static" contentClassName={styles.modalDark}>
  <Modal.Header closeButton>
    <Modal.Title>Matricular Aluno</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>Turma: <strong>{turmaParaMatricular?.nome_turma}</strong></p>
    <Form>
      <Form.Group className="mb-3" controlId="nomeAluno">
        <Form.Label>Nome do Aluno *</Form.Label>
        <Form.Control
          type="text"
          placeholder="Digite o nome do aluno"
          value={nomeAlunoMatricula}
          onChange={e => setNomeAlunoMatricula(e.target.value)}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={fecharModalMatricula}>Cancelar</Button>
    <Button
      variant="primary"
      onClick={handleMatricularAluno}
      disabled={nomeAlunoMatricula.trim() === ''}
    >
      Matricular
    </Button>
  </Modal.Footer>
</Modal>










    </div>
  );
}
