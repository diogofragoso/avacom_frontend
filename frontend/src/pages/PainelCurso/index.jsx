import React, { useState, useEffect } from 'react';
import styles from './PainelCurso.module.css';
import { Outlet } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';
import EditarCurso from '../../components/EditarCurso';
import cursoService from '../../services/cursoService';
import { Nav, NavItem, NavLink, Navbar, Button, Modal, Form, Row, Col, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap';

function PainelCurso() {
  const [cursos, setCursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nome_curso: '', descricao_curso: '' });
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    carregarCursos();
  }, []);

  // Função separada para carregar cursos
  const carregarCursos = async () => {
    try {
      const data = await cursoService.getCursos();
      setCursos(data);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setFormData({ nome_curso: '', descricao_curso: '' });
    setFeedback({ type: '', message: '' });
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cursoService.createCurso(formData);
      setFeedback({ type: 'success', message: 'Curso inserido com sucesso!' });
      setFormData({ nome_curso: '', descricao_curso: '' });
      setShowModal(false);  // <-- Aqui estava errado: era `setShowModalAdd(false)` mas o nome do seu modal é `showModal`
      await carregarCursos(); // <- ESSA LINHA É ESSENCIAL
    } catch (error) {
      console.error('Erro ao cadastrar curso:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar curso: ' + error.message });
    }
  };

  return (
    <div className={styles.painelcurso}>
      <div className="row">
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
          <Nav tabs>
            <NavItem>
              <NavLink className={styles.navLink}>
                <NavLink2 to="RegistroCurso">Cadastrar</NavLink2>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className={styles.navLink}>
                <NavLink2 to="EditarCurso">Editar</NavLink2>
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>

        <div className="mt-3 mb-3">
          <Button variant="dark" onClick={handleOpenModal}>
            + Novo Curso
          </Button>
        </div>

        {/* Passa os cursos para o componente de edição */}
        <EditarCurso cursos={cursos} />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Curso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {feedback.message && (
            <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible>
              {feedback.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <FormGroup as={Row} className="mb-3">
              <FormLabel column sm={2}>
                Nome
              </FormLabel>
              <Col sm={10}>
                <FormControl
                  type="text"
                  name="nome_curso"
                  placeholder="Digite o nome do curso"
                  value={formData.nome_curso}
                  onChange={handleChange}
                  required
                />
              </Col>
            </FormGroup>

            <FormGroup as={Row} className="mb-3">
              <FormLabel column sm={2}>
                Descrição
              </FormLabel>
              <Col sm={10}>
                <FormControl
                  type="text"
                  name="descricao_curso"
                  placeholder="Breve descrição do curso"
                  value={formData.descricao_curso}
                  onChange={handleChange}
                  required
                />
              </Col>
            </FormGroup>        


            <Button variant="dark" type="submit" className="mt-2 me-2 ">Cadastrar</Button>
            <Button variant="secondary" onClick={handleCloseModal} className="mt-2">Cancelar</Button>
           
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PainelCurso;
