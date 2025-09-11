import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup, Row, Col } from 'react-bootstrap';
import './ModalSelecionarAtividade.css'; 

function ModalSelecionarAtividadeAvaliativa({ show, handleClose, ucs, onSelecionar }) {
  const [ucSelecionadaId, setUcSelecionadaId] = useState('');
  const [indicadorSelecionadoId, setIndicadorSelecionadoId] = useState('');
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(null);

  const ucsList = Array.isArray(ucs) ? ucs : [];

  useEffect(() => {
    if (!show) {
      setUcSelecionadaId('');
      setIndicadorSelecionadoId('');
      setAtividadeSelecionada(null);
    }
  }, [show]);

  const ucAtual = ucsList.find(uc => uc.id_uc === ucSelecionadaId);
  const indicadores = ucAtual?.indicadores || [];
  
  const indicadorAtual = indicadores.find(ind => ind.id_indicador === indicadorSelecionadoId);
  const avaliativas = indicadorAtual?.avaliativas || [];

  const handleUcChange = (e) => {
    setUcSelecionadaId(Number(e.target.value));
    setIndicadorSelecionadoId('');
    setAtividadeSelecionada(null);
  };

  const handleIndicadorChange = (e) => {
    setIndicadorSelecionadoId(Number(e.target.value));
    setAtividadeSelecionada(null);
  };

  const handleContinuarAvaliacao = () => {
    if (atividadeSelecionada && ucAtual && indicadorAtual) {
        onSelecionar({
            ...atividadeSelecionada,
            ucNome: ucAtual.nome_uc,
            numero_uc: ucAtual.numero_uc, // Enviando também o número
            indicadorDescricao: indicadorAtual.descricao_indicador,
            numero_indicador: indicadorAtual.numero_indicador // Enviando também o número
        });
        handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Avaliar Atividade</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted">Selecione a UC, indicador e atividade para avaliar</p>
        
        {/* --- LAYOUT MODIFICADO --- */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">1. Selecione a Unidade Curricular (UC)</Form.Label>
          <Form.Select value={ucSelecionadaId} onChange={handleUcChange}>
            <option value="">Selecione...</option>
            {ucsList.map(uc => (
              // MODIFICADO: Exibindo número e nome da UC
              <option key={uc.id_uc} value={uc.id_uc}>
                {uc.numero_uc} - {uc.nome_uc}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* --- LAYOUT MODIFICADO --- */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">2. Selecione o Indicador de Avaliação</Form.Label>
          <Form.Select value={indicadorSelecionadoId} onChange={handleIndicadorChange} disabled={!ucSelecionadaId}>
            <option value="">Selecione...</option>
            {indicadores.map(indicador => (
              // MODIFICADO: Exibindo número e descrição do Indicador
              <option key={indicador.id_indicador} value={indicador.id_indicador}>
                {indicador.numero_indicador} - {indicador.descricao_indicador}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* --- LAYOUT MODIFICADO --- */}
        <Form.Group className="mb-3">
            <Form.Label className="fw-bold">3. Selecione a Atividade para Avaliar</Form.Label>
        </Form.Group>
        
        <div className="lista-atividades-container">
          {indicadorSelecionadoId ? (
            avaliativas.length > 0 ? (
              <ListGroup>
                {avaliativas.map(avaliativa => (
                  <ListGroup.Item 
                    action
                    key={avaliativa.id_avaliativa} 
                    onClick={() => setAtividadeSelecionada(avaliativa)}
                    active={atividadeSelecionada?.id_avaliativa === avaliativa.id_avaliativa}
                  >
                    <Row className="align-items-center">
                      <Col xs="auto" className="pe-0">
                        <Form.Check
                          type="radio"
                          id={`radio-${avaliativa.id_avaliativa}`}
                          name="atividadeRadio"
                          checked={atividadeSelecionada?.id_avaliativa === avaliativa.id_avaliativa}
                          onChange={() => setAtividadeSelecionada(avaliativa)}
                        />
                      </Col>
                      <Col>
                        <strong>{avaliativa.descricao_avaliativa}</strong>
                      </Col>
                      <Col xs="auto">
                        <span className="arrow-icon">&rsaquo;</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p className="text-muted ms-3">Nenhuma atividade encontrada para este indicador.</p>
            )
          ) : (
            <p className="text-muted ms-3">Selecione uma UC e um Indicador para ver as atividades.</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleContinuarAvaliacao} 
          disabled={!atividadeSelecionada}
        >
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalSelecionarAtividadeAvaliativa;