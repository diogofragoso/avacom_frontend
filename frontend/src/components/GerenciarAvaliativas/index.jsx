// Caminho: src/components/GerenciarAvaliativa/index.js

import React, { useState, useEffect } from 'react'; // <--- LINHA CORRIGIDA
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Spinner, Alert, Button } from 'react-bootstrap';
import avaliacaoService from '../../services/avaliacaoService';
import './GerenciarAvaliativas.module.css';

function GerenciarAvaliativa() {
  const navigate = useNavigate();
  const location = useLocation();

  const { turma, estudante } = location.state || {};

  const [matrizCompleta, setMatrizCompleta] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [ucSelecionadaId, setUcSelecionadaId] = useState(null);
  const [indicadorSelecionadoId, setIndicadorSelecionadoId] = useState(null);
  const [atividadesSelecionadasIds, setAtividadesSelecionadasIds] = useState([]);

  useEffect(() => {
    if (!turma?.id_curso_fk) {
      setErro("Dados da turma não encontrados. Volte e tente novamente.");
      setCarregando(false);
      return;
    }
    const carregarDados = async () => {
      try {
        const dados = await avaliacaoService.getMatriz(turma.id_curso_fk);
        setMatrizCompleta(dados);
        if (dados?.ucs?.length > 0) {
          setUcSelecionadaId(dados.ucs[0].id_uc);
        }
      } catch (err) {
        setErro("Não foi possível carregar os dados de avaliação.");
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, [turma]);

  const ucs = matrizCompleta?.ucs || [];
  const indicadoresFiltrados = ucs.find(uc => uc.id_uc === ucSelecionadaId)?.indicadores || [];
  const atividadesFiltradas = indicadoresFiltrados.find(ind => ind.id_indicador === indicadorSelecionadoId)?.avaliativas || [];

  const handleSelecionarUc = (id) => {
    setUcSelecionadaId(id);
    setIndicadorSelecionadoId(null);
    setAtividadesSelecionadasIds([]);
  };

  const handleSelecionarIndicador = (id) => {
    setIndicadorSelecionadoId(id);
    setAtividadesSelecionadasIds([]);
  };
  
  const handleToggleAtividade = (id) => {
    setAtividadesSelecionadasIds(prevIds => 
      prevIds.includes(id) 
        ? prevIds.filter(prevId => prevId !== id)
        : [...prevIds, id]
    );
  };

  if (carregando) return <Container className="text-center mt-5"><Spinner /></Container>;
  if (erro) return <Container className="mt-5"><Alert variant="danger">{erro}</Alert></Container>;

  return (
    <Container fluid className="gerenciar-avaliativa-page p-4">
      <div className="page-header mb-4">
        <h2>Avaliação de Atividades: {estudante?.nome_aluno || 'Aluno'}</h2>
        <p className="text-muted">Selecione UC, indicadores e atividades para avaliar</p>
      </div>

      <Row>
        {/* Coluna 1: Unidades Curriculares */}
        <Col md={3}>
          <div className="column-header">
            <h5>1️⃣ Unidades Curriculares</h5>
          </div>
          <div className="uc-list">
            {ucs.map(uc => (
              <Card 
                key={uc.id_uc} 
                className={`uc-card ${uc.id_uc === ucSelecionadaId ? 'selected' : ''}`}
                onClick={() => handleSelecionarUc(uc.id_uc)}
              >
                <Card.Body>
                  <strong>{uc.nome_uc}</strong>
                  <span className="subtext d-block">{uc.numero_uc} - Detalhes da UC</span>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>

        {/* Coluna 2: Indicadores de Avaliação */}
        <Col md={4}>
          <div className="column-header">
            <h5>2️⃣ Indicadores de Avaliação</h5>
          </div>
          <div className="indicador-list">
            {indicadoresFiltrados.map(indicador => (
              <Card 
                key={indicador.id_indicador} 
                className={`indicador-card ${indicador.id_indicador === indicadorSelecionadoId ? 'selected' : ''}`}
                onClick={() => handleSelecionarIndicador(indicador.id_indicador)}
              >
                <Card.Body>
                  <strong>{indicador.descricao_indicador}</strong>
                  <span className="subtext d-block">{indicador.avaliativas.length} atividades</span>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>

        {/* Coluna 3: Atividades Avaliativas */}
        <Col md={5}>
          <div className="column-header d-flex justify-content-between align-items-center">
            <h5>3️⃣ Atividades Avaliativas</h5>
            <small>{atividadesSelecionadasIds.length} selecionadas</small>
          </div>
          <div className="atividade-list">
            {atividadesFiltradas.map(atividade => (
              <Card key={atividade.id_avaliativa} className="atividade-card">
                <Card.Body className="d-flex align-items-center">
                  <Form.Check 
                    type="checkbox"
                    id={`check-${atividade.id_avaliativa}`}
                    checked={atividadesSelecionadasIds.includes(atividade.id_avaliativa)}
                    onChange={() => handleToggleAtividade(atividade.id_avaliativa)}
                  />
                  <div className="ms-3">
                    <strong>{atividade.descricao_avaliativa}</strong>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
        <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
            <Button variant="primary" className="ms-2">Salvar Avaliação</Button>
        </div>
    </Container>
  );
}

export default GerenciarAvaliativa;