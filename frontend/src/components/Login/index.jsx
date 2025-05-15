import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import styles from './Login.module.css';

export default function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleForm = () => setShowRegister(!showRegister);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Container fluid className={styles.pageWrapper}>
      <Row className="vh-100">
        {/* Lado Esquerdo */}
        <Col md={6} className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <h1>Bem-vindo ao Portal Educacional</h1>
            <p>Uma plataforma completa para avaliação do percurso formativo</p>
          </div>
        </Col>

        {/* Lado Direito */}
        <Col md={6} className={styles.rightPanel}>
          <div className={styles.formContainer}>
            <h3 className="text-center mb-4">{showRegister ? 'Cadastro' : 'Login'}</h3>

            <Form>
              {showRegister && (
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control type="text" placeholder="Digite seu nome completo" />
                </Form.Group>
              )}

              <Form.Group className={`mb-3 ${styles.inputWithIcon}`}>
                <Form.Label>Email</Form.Label>
                <div className={styles.iconInputWrapper}>
                  <FaEnvelope className={styles.inputIcon} />
                  <Form.Control type="email" placeholder="Digite seu email" />
                </div>
              </Form.Group>

              <Form.Group className={`mb-3 ${styles.inputWithIcon}`}>
                <Form.Label>Senha</Form.Label>
                <div className={styles.iconInputWrapper}>
                  <FaLock className={styles.inputIcon} />
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    className={styles.passwordInput}
                  />
                  <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </Form.Group>

              {showRegister && (
                <Form.Group className="mb-3">
                  <Form.Label>Perfil</Form.Label>
                  <Form.Select>
                    <option value="aluno">Aluno</option>
                    <option value="professor">Professor</option>
                  </Form.Select>
                </Form.Group>
              )}

              <div className="d-grid">
                <Button className={styles.customButton} type="submit">
                  {showRegister ? 'Cadastrar' : 'Entrar'}
                </Button>
              </div>

              <p className="text-center mt-3">
                {showRegister ? (
                  <>
                    Já tem uma conta?{' '}
                    <span className={styles.toggleLink} onClick={toggleForm}>
                      Entrar
                    </span>
                  </>
                ) : (
                  <>
                    Novo por aqui?{' '}
                    <span className={styles.toggleLink} onClick={toggleForm}>
                      Criar uma conta
                    </span>
                  </>
                )}
              </p>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
