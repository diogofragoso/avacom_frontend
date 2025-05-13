// src/components/Login.jsx
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import styles from './Login.module.css';

export default function Login() {
  const [showRegister, setShowRegister] = useState(false);

  const toggleForm = () => setShowRegister(!showRegister);

  return (
    <Container className={styles.loginContainer}>
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className={styles.loginCard}>
            <Card.Body>
              <h3 className="text-center mb-4">{showRegister ? 'Cadastro' : 'Login'}</h3>

              <Form>
                {showRegister && (
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" placeholder="Digite seu nome completo" />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Digite seu email" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" placeholder="Digite sua senha" />
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
                      Não tem uma conta?{' '}
                      <span className={styles.toggleLink} onClick={toggleForm}>
                        Cadastrar-se
                      </span>
                    </>
                  )}
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
