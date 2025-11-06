import React from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
// 1. Importar o CSS Module
import styles from './MetricasTurmas.module.css';

// --- DADOS ESTÁTICOS (MOCK) ---
// Note que as 'variants' estão em camelCase para bater com as classes do CSS Module
const dadosTurma = {
  nome: 'Técnico em informática - T1',
  totalEstudantes: 32,
  totalIndicadores: 4,
  taxaAprovacao: 85,
  metricasGerais: {
    atingiu: 15,
    parcialmenteAtingiu: 12,
    naoAtingiu: 3,
    naoAvaliado: 2,
  },
  distribuicao: [
    { label: 'A - Atingiu', valor: 15, percentual: 46.9, variant: 'atingiu' },
    { label: 'PA - Parcialmente Atingiu', valor: 12, percentual: 37.5, variant: 'parcial' },
    { label: 'NA - Não Atingiu', valor: 3, percentual: 9.4, variant: 'naoAtingiu' },
    { label: '-- Não Avaliado', valor: 2, percentual: 6.2, variant: 'naoAvaliado' },
  ],
  indicadores: [
    {
      id: 1,
      titulo: 'Indicador 1 - Operações Básicas',
      atividade: 'Prova Diagnóstica',
      resultados: [
        { sigla: 'A', valor: 18, variant: 'atingiu' },
        { sigla: 'PA', valor: 10, variant: 'parcial' },
        { sigla: 'NA', valor: 3, variant: 'naoAtingiu' },
        { sigla: '-', valor: 1, variant: 'naoAvaliado' },
      ],
    },
    {
      id: 2,
      titulo: 'Indicador 2 - Resolução de Problemas',
      atividade: 'Trabalho em Grupo',
      resultados: [
        { sigla: 'A', valor: 15, variant: 'atingiu' },
        { sigla: 'PA', valor: 12, variant: 'parcial' },
        { sigla: 'NA', valor: 4, variant: 'naoAtingiu' },
        { sigla: '-', valor: 1, variant: 'naoAvaliado' },
      ],
    },
    {
      id: 3,
      titulo: 'Indicador 3 - Raciocínio Lógico',
      atividade: 'Prova Individual',
      resultados: [
        { sigla: 'A', valor: 12, variant: 'atingiu' },
        { sigla: 'PA', valor: 14, variant: 'parcial' },
        { sigla: 'NA', valor: 5, variant: 'naoAtingiu' },
        { sigla: '-', valor: 1, variant: 'naoAvaliado' },
      ],
    },
  ],
};
// ------------------------------


function MetricasTurma() {
  return (
    // 2. Aplicar as classes usando o objeto 'styles'
    <Container fluid className={`${styles.dashboardMetricas} p-4`}>
      {/* Cabeçalho */}
      <Row className="mb-4">
        <Col>
          <h2 className="h4">{dadosTurma.nome}</h2>
          <p className="text-muted">
            {dadosTurma.totalEstudantes} estudantes • {dadosTurma.totalIndicadores} indicadores
          </p>
        </Col>
      </Row>

      {/* Cartões KPI */}
      <Row>
        <Col md={3}>
          <Card className={`shadow-sm border-0 ${styles.kpiCard}`}>
            <Card.Body>
              <Card.Title className={styles.kpiTitle}>Taxa de Aprovação</Card.Title>
              <div className={`text-primary ${styles.kpiValue}`}>{dadosTurma.taxaAprovacao}%</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className={`shadow-sm border-0 ${styles.kpiCard}`}>
            <Card.Body>
              <Card.Title className={styles.kpiTitle}>Atingiu (A)</Card.Title>
              <div className={`${styles.textAtingiu} ${styles.kpiValue}`}>
                {dadosTurma.metricasGerais.atingiu}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className={`shadow-sm border-0 ${styles.kpiCard}`}>
            <Card.Body>
              <Card.Title className={styles.kpiTitle}>Parcialmente (PA)</Card.Title>
              <div className={`${styles.textParcial} ${styles.kpiValue}`}>
                {dadosTurma.metricasGerais.parcialmenteAtingiu}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className={`shadow-sm border-0 ${styles.kpiCard}`}>
            <Card.Body>
              <Card.Title className={styles.kpiTitle}>Não Atingiu (NA)</Card.Title>
              <div className={`${styles.textNaoAtingiu} ${styles.kpiValue}`}>
                {dadosTurma.metricasGerais.naoAtingiu}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Gráficos e Indicadores */}
      <Row className="mt-4">
        {/* Coluna da Esquerda: Distribuição */}
        <Col lg={5}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title>Distribuição de Menções</Card.Title>
              <div className="mt-4">
                {dadosTurma.distribuicao.map((item) => (
                  <div key={item.label} className="mb-3">
                    <div className="d-flex justify-content-between text-muted mb-1">
                      <span>{item.label}</span>
                      <span>{item.valor} estudantes ({item.percentual}%)</span>
                    </div>
                    <ProgressBar 
                      // 3. Passar a classe global e a variant personalizada
                      className="progress-bar-custom" 
                      now={item.percentual} 
                      variant={item.variant} 
                    />
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Coluna da Direita: Indicadores */}
        <Col lg={7}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title>Indicadores e Atividades</Card.Title>
              <div className="mt-3">
                {dadosTurma.indicadores.map((ind) => (
                  <div key={ind.id} className={`p-3 mb-2 border rounded ${styles.indicadorItem}`}>
                    <h6>{ind.titulo}</h6>
                    <p className="text-muted small mb-2">{ind.atividade}</p>
                    <div>
                      {ind.resultados.map((res) => (
                        // 4. Usar um <span> e aplicar as classes do module
                        <span 
                          key={res.sigla} 
                          className={`${styles.badgeCustom} ${styles[res.variant]}`}
                        >
                          {res.sigla} {res.valor}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default MetricasTurma;