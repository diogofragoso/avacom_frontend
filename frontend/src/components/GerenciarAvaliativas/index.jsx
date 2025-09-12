import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner, Alert, Button, Form } from 'react-bootstrap';
import avaliacaoService from '../../services/avaliacaoService'; // Sua importação do serviço
import styles from './GerenciarAvaliativas.module.css'; // O CSS da resposta anterior

// Objeto para mapear nomes de matérias para classes CSS
const ucStyleMap = {
  'matemática': { colorClass: 'matematica' },
  'português': { colorClass: 'portugues' },
  'história': { colorClass: 'historia' },
  'física': { colorClass: 'fisica' },
  'química': { colorClass: 'quimica' },
  'biologia': { colorClass: 'biologia' },
};
const defaultStyle = { colorClass: 'default' };

const getUcStyle = (ucName) => {
  if (!ucName) return defaultStyle;
  // Normaliza o nome para remover acentos e pegar a primeira palavra
  const normalizedName = ucName.toLowerCase().split(' ')[0]
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return ucStyleMap[normalizedName] || defaultStyle;
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

  useEffect(() => {
    // Verifica se os dados necessários da turma existem
    if (!turma?.id_curso_fk) {
      setErro("Dados da turma não encontrados. Volte e tente novamente.");
      setCarregando(false);
      return;
    }
    
    // Função para carregar os dados da sua API
    const carregarDados = async () => {
      try {
        setCarregando(true); // Garante que o spinner apareça ao carregar
        
        // --- SUA LÓGICA DE API RESTAURADA AQUI ---
        const dados = await avaliacaoService.getMatriz(turma.id_curso_fk);
        
        setMatrizCompleta(dados);
        
        // Seleciona a primeira UC da lista por padrão
        if (dados?.ucs?.length > 0) {
          setUcSelecionadaId(dados.ucs[0].id_uc);
        }
      } catch (err) {
        console.error("Erro ao carregar dados da matriz:", err);
        setErro("Não foi possível carregar os dados de avaliação. Tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [turma]); // Dependência do useEffect

  // Lógica para filtrar os dados com base na seleção (sem alterações)
  const ucs = matrizCompleta?.ucs || [];
  const indicadoresFiltrados = ucs.find(uc => uc.id_uc === ucSelecionadaId)?.indicadores || [];
  const atividadesFiltradas = indicadoresFiltrados.find(ind => ind.id_indicador === indicadorSelecionadoId)?.avaliativas || [];

  // Funções de manipulação de estado (sem alterações)
  const handleSelecionarUc = (id) => { setUcSelecionadaId(id); setIndicadorSelecionadoId(null); setAtividadesSelecionadasIds([]); };
  const handleSelecionarIndicador = (id) => { setIndicadorSelecionadoId(id); setAtividadesSelecionadasIds([]); };
  const handleToggleAtividade = (id) => { setAtividadesSelecionadasIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]); };

  // Renderização de loading e erro (sem alterações)
  if (carregando) return <Container className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}><Spinner animation="border" /></Container>;
  if (erro) return <Container className="mt-5"><Alert variant="danger">{erro}</Alert></Container>;

  // JSX do componente (sem alterações na estrutura, apenas populado pela API)
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
        {/* Coluna 1: Unidades Curriculares */}
        <Col md={3}>
          <h5 className={styles.columnTitle}><span>1</span> Unidades Curriculares</h5>
          {ucs.map(uc => {
            const ucStyle = getUcStyle(uc.nome_uc);
            const isSelected = uc.id_uc === ucSelecionadaId;
            return (
              <div
                key={uc.id_uc}
                className={`${styles.ucCard} ${styles[ucStyle.colorClass]} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleSelecionarUc(uc.id_uc)}
              >
                <div className={styles.ucCardBody}>
                  <strong>{uc.nome_uc}</strong>
                  <div className="text-muted">{uc.descricao_uc}</div>
                </div>
              </div>
            );
          })}
        </Col>

    

        {/* Coluna 2: Indicadores de Avaliação */}
        <Col md={4}>
          <h5 className={styles.columnTitle}><span>2</span> Indicadores de Avaliação</h5>
          {ucSelecionadaId && indicadoresFiltrados.map(indicador => (
            <div
              key={indicador.id_indicador}
              className={`${styles.indicadorCard} ${indicador.id_indicador === indicadorSelecionadoId ? styles.selected : ''}`}
              onClick={() => handleSelecionarIndicador(indicador.id_indicador)}
            >
              <div className="d-flex justify-content-between align-items-center p-3">
                <div>
                  <strong>{indicador.descricao_indicador}</strong>
                  <div className="text-muted small">{indicador.avaliativas?.length || 0} atividades</div>
                </div>
                {/* REMOVIDO: <span>&gt;</span> */}
                {/* O triângulo será gerado pelo CSS ::after no .indicadorCard */}
              </div>
            </div>
          ))}
        </Col>



        {/* Coluna 3: Atividades Avaliativas */}
        <Col md={5}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className={styles.columnTitle}><span>3</span> Atividades Avaliativas</h5>
            {atividadesFiltradas.length > 0 && <Button variant="link" size="sm">Selecionar Todas</Button>}
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
                <strong>{atividade.descricao_avaliativa}</strong>
                <div className={styles.atividadeMeta}>
                    <span>🔹 {atividade.tipo || 'Não definido'}</span>
                    <span>📅 {new Date(atividade.data).toLocaleDateString('pt-BR')}</span>
                    <span>👥 {atividade.alunos || 0} alunos</span>
                    <span className={styles.statusPendente}>Pendente</span>
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