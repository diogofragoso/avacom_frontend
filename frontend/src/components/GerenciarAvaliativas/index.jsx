import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button, Form } from 'react-bootstrap';
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
  const [atividadesSelecionadasIds, setAtividadesSelecionadasIds] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);

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

  const handleSelecionarUc = (id) => { setUcSelecionadaId(id); setIndicadorSelecionadoId(null); setAtividadesSelecionadasIds([]); setExpandedIds([]); };
  const handleSelecionarIndicador = (id) => { setIndicadorSelecionadoId(id); setAtividadesSelecionadasIds([]); setExpandedIds([]); };
  const handleToggleAtividade = (id) => { setAtividadesSelecionadasIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]); };
  const toggleExpand = (id) => { setExpandedIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]); };
  const selecionarTodas = () => { setAtividadesSelecionadasIds(atividadesFiltradas.map(a => a.id_avaliativa)); };

  if (carregando) return <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}><Spinner animation="border" /></Container>;
  if (erro) return <Container className="mt-5"><Alert variant="danger">{erro}</Alert></Container>;

  const corClasseUcSelecionada = ucSelecionada ? getStyleClassForId(ucSelecionada.id_uc) : 'default';

  return (
    <div className={`p-4 ${styles.pageContainer}`}>
      <div className={styles.header}>
        <div>
          <h3>Avaliação de Atividades</h3>
          <p>Selecione UC, indicadores e atividades para avaliar</p>
        </div>
      </div>

      <div className={styles.stepsContainer}>
        <div className={`${styles.step} ${ucSelecionadaId ? styles.active : ''}`}>
          <span>1</span> Selecionar UC
        </div>
        <div className={`${styles.step} ${indicadorSelecionadoId ? styles.active : ''}`}>
          <span>2</span> Escolher Indicador
        </div>
        <div className={`${styles.step} ${atividadesSelecionadasIds.length > 0 ? styles.active : ''}`}>
          <span>3</span> Selecionar Atividades
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
            <h5 className={styles.columnTitle}><span>3</span> Atividades Avaliativas</h5>
            {atividadesFiltradas.length > 0 && <Button size="sm" variant="outline-primary" onClick={selecionarTodas}>Selecionar Todas</Button>}
          </div>
          {indicadorSelecionadoId && atividadesFiltradas.map(atividade => (
            <div key={atividade.id_avaliativa} className={styles.atividadeItem}>
              <Form.Check
                type="checkbox"
                id={`check-${atividade.id_avaliativa}`}
                checked={atividadesSelecionadasIds.includes(atividade.id_avaliativa)}
                onChange={() => handleToggleAtividade(atividade.id_avaliativa)}
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
                <div className={styles.atividadeMeta}>
                </div>
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default GerenciarAvaliativa;
