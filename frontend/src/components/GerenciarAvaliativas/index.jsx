import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button, Form, Toast, ToastContainer } from 'react-bootstrap';
import avaliacaoService from '../../services/avaliacaoService';
import styles from './GerenciarAvaliativas.module.css';

// Array de classes de cor definidas no CSS
const colorClasses = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7'];

// Função que retorna uma classe de cor de forma consistente, baseado no ID
const getStyleClassForId = (id) => {
  if (id === null || id === undefined) return 'default';
  const numericId = typeof id === 'string'
    ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    : id;
  const index = numericId % colorClasses.length;
  return colorClasses[index];
};

function GerenciarAvaliativa() {
  const navigate = useNavigate();
  const location = useLocation();
  const { turma } = location.state || {};

  const [matrizCompleta, setMatrizCompleta] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [ucSelecionadaId, setUcSelecionadaId] = useState(null);
  const [indicadorSelecionadoId, setIndicadorSelecionadoId] = useState(null);
  const [atividadeSelecionadaId, setAtividadeSelecionadaId] = useState(null);
  const [expandedIds, setExpandedIds] = useState([]);
  const [salvando, setSalvando] = useState(false);

  // Estados para controlar o Toast
  const [showToast, setShowToast] = useState(false);
  const [toastInfo, setToastInfo] = useState({
    variant: 'success', // 'success', 'danger', 'warning'
    title: '',
    message: ''
  });

  useEffect(() => {
    if (!turma?.id_curso_fk) {
      setErro("Dados da turma não encontrados. Volte e tente novamente.");
      setCarregando(false);
      return;
    }

    const carregarDados = async () => {
      try {
        setCarregando(true);
        const dados = await avaliacaoService.getMatriz(turma.id_curso_fk);
        setMatrizCompleta(dados);
        if (dados?.ucs?.length > 0) setUcSelecionadaId(dados.ucs[0].id_uc);
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar os dados de avaliação.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [turma]);

  const ucs = matrizCompleta?.ucs || [];
  const ucSelecionada = ucs.find(uc => uc.id_uc === ucSelecionadaId);
  const indicadoresFiltrados = ucSelecionada?.indicadores || [];
  const atividadesFiltradas = indicadoresFiltrados.find(ind => ind.id_indicador === indicadorSelecionadoId)?.avaliativas || [];

  const handleSelecionarUc = (id) => {
    setUcSelecionadaId(id);
    setIndicadorSelecionadoId(null);
    setAtividadeSelecionadaId(null);
    setExpandedIds([]);
  };

  const handleSelecionarIndicador = (id) => {
    setIndicadorSelecionadoId(id);
    setAtividadeSelecionadaId(null);
    setExpandedIds([]);
  };

  const handleSelecionarAtividade = (id) => {
    setAtividadeSelecionadaId(prev => prev === id ? null : id); // Toggle
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSalvarSelecionada = async () => {
    if (!ucSelecionadaId || !indicadorSelecionadoId || !atividadeSelecionadaId) {
      setToastInfo({
        variant: 'warning',
        title: 'Atenção',
        message: 'Selecione uma UC, um indicador e uma atividade para salvar.'
      });
      setShowToast(true);
      return;
    }

    const payload = {
      id_turma_fk: turma.id_turma,
      id_avaliativa_fk: atividadeSelecionadaId,
      id_indicador_fk: indicadorSelecionadoId
    };

    setSalvando(true);

    try {
      const response = await avaliacaoService.salvar(payload);
      setToastInfo({
        variant: 'success',
        title: 'Sucesso!',
        message: response.message || 'Operação realizada com sucesso!'
      });
      setShowToast(true);
      setAtividadeSelecionadaId(null);
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Ocorreu um erro inesperado.";
      setToastInfo({
        variant: 'danger',
        title: 'Erro ao Salvar',
        message: errorMessage
      });
      setShowToast(true);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}><Spinner animation="border" /></Container>;
  if (erro) return <Container className="mt-5"><Alert variant="danger">{erro}</Alert></Container>;

  const corClasseUcSelecionada = ucSelecionada ? getStyleClassForId(ucSelecionada.id_uc) : 'default';

  return (
    <div className={`p-4 ${styles.pageContainer}`}>
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050 }}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
          bg={toastInfo.variant.toLowerCase()}
          className={toastInfo.variant === 'warning' ? 'text-dark' : 'text-white'}
        >
          <Toast.Header>
            <strong className="me-auto">{toastInfo.title}</strong>
          </Toast.Header>
          <Toast.Body>{toastInfo.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className={styles.header}>
        <div>
          <h3>Avaliação de Atividades</h3>
          <p>Selecione UC, indicadores e atividade para avaliar</p>
        </div>
      </div>

      <div className={styles.stepsContainer}>
        <div className={`${styles.step} ${ucSelecionadaId ? styles.active : ''}`}>
          <span>1</span> Selecionar UC
        </div>
        <div className={`${styles.step} ${indicadorSelecionadoId ? styles.active : ''}`}>
          <span>2</span> Escolher Indicador
        </div>
        <div className={`${styles.step} ${atividadeSelecionadaId ? styles.active : ''}`}>
          <span>3</span> Selecionar Atividade
        </div>
      </div>

      <Row>
        {/* Coluna 1: UCs */}
        <Col xs={12} md={3}>
          <h5 className={styles.columnTitle}><span>1</span> Unidades Curriculares</h5>
          {ucs.map(uc => {
            const isSelected = uc.id_uc === ucSelecionadaId;
            const styleClass = getStyleClassForId(uc.id_uc);
            return (
              <div key={uc.id_uc} className={`${styles.ucCard} ${styles[styleClass]} ${isSelected ? styles.selected : ''}`} onClick={() => handleSelecionarUc(uc.id_uc)}>
                <div className={styles.ucCardBody}>
                  <div className={styles.ucNumeroBadge}>UC {uc.numero_uc}</div>
                  <strong>{uc.nome_uc}</strong>
                  <div className="text-muted">{uc.descricao_uc || "Sem descrição"}</div>
                </div>
              </div>
            );
          })}
        </Col>

        {/* Coluna 2: Indicadores */}
        <Col xs={12} md={4}>
          <h5 className={styles.columnTitle}><span>2</span> Indicadores de Avaliação</h5>
          {ucSelecionadaId && indicadoresFiltrados.map(indicador => {
            const isSelected = indicador.id_indicador === indicadorSelecionadoId;
            return (
              <div key={indicador.id_indicador} className={`${styles.indicadorCard} ${styles[corClasseUcSelecionada]} ${isSelected ? styles.selected : ''}`} onClick={() => handleSelecionarIndicador(indicador.id_indicador)}>
                <div className={styles.indicadorCardBody}>
                  <div className={styles.indicadorNumeroBadge}>Indicador {indicador.numero_indicador}</div>
                  <strong>{indicador.descricao_indicador}</strong>
                  <div className="text-muted small">{indicador.avaliativas?.length || 0} atividades</div>
                </div>
              </div>
            );
          })}
        </Col>

        {/* Coluna 3: Atividades */}
        <Col xs={12} md={5}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className={styles.columnTitle}><span>3</span> Atividade Avaliativa</h5>
            <Button
              size="sm"
              variant="success"
              onClick={handleSalvarSelecionada}
              disabled={!atividadeSelecionadaId || salvando}
            >
              {salvando ? <Spinner as="span" animation="border" size="sm" /> : 'Salvar Atividade'}
            </Button>
          </div>
          {indicadorSelecionadoId && atividadesFiltradas.map(atividade => (
            <div key={atividade.id_avaliativa} className={styles.atividadeItem}>
              <Form.Check
                type="radio"
                name="atividadeSelecionada"
                id={`check-${atividade.id_avaliativa}`}
                checked={atividadeSelecionadaId === atividade.id_avaliativa}
                onChange={() => handleSelecionarAtividade(atividade.id_avaliativa)}
              />
              <div className={styles.atividadeDetails}>
                <strong>
                  {atividade.descricao_avaliativa.length > 80 && !expandedIds.includes(atividade.id_avaliativa)
                    ? `${atividade.descricao_avaliativa.slice(0, 80)}...`
                    : atividade.descricao_avaliativa
                  }
                </strong>
                {atividade.descricao_avaliativa.length > 80 && (
                  <Button variant="link" size="sm" onClick={() => toggleExpand(atividade.id_avaliativa)}>
                    {expandedIds.includes(atividade.id_avaliativa) ? 'ver menos' : 'ver mais'}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default GerenciarAvaliativa;