import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaIdCard, FaBuilding } from 'react-icons/fa';
import styles from './Login.module.css';
import usuarioService from '../../services/usuarioService';

export default function Login() {
    // --- ESTADOS ---
    const [showRegister, setShowRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        tipo_usuario: 'aluno',
        numero_matricula: '',
        departamento: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // --- FUNÇÕES ---
    const toggleForm = () => {
        setShowRegister(!showRegister);
        setError(null);
        setSuccessMessage(null);
        setFormData({
            nome: '', email: '', senha: '', tipo_usuario: 'aluno',
            numero_matricula: '', departamento: ''
        });
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- LÓGICA PRINCIPAL DO FORMULÁRIO ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        if (showRegister) {
            // --- LÓGICA DE CADASTRO (já funcional) ---
            try {
                const dadosParaEnviar = { ...formData };
                if (dadosParaEnviar.tipo_usuario === 'aluno') {
                    delete dadosParaEnviar.departamento;
                } else {
                    delete dadosParaEnviar.numero_matricula;
                }
                const response = await usuarioService.criarUsuario(dadosParaEnviar);
                setSuccessMessage(response.message + " Agora você já pode fazer o login.");
                setTimeout(() => {
                    toggleForm();
                }, 3000);
            } catch (err) {
                setError(err.error || 'Não foi possível completar o cadastro.');
            } finally {
                setIsLoading(false);
            }
        } else {
            // ✨ --- LÓGICA DE LOGIN IMPLEMENTADA --- ✨
            try {
                const credenciais = {
                    email: formData.email,
                    senha: formData.senha,
                };

                await usuarioService.login(credenciais);

                // Se o login for bem-sucedido, o cookie é definido automaticamente pelo backend.
                // Agora, redirecionamos o usuário para a página principal do sistema.
                // (Você pode criar um alerta de sucesso aqui também se desejar)
                window.location.href = '/'; // Ou a rota para sua página principal

            } catch (err) {
                // Captura o erro da API (ex: "Credenciais inválidas.")
                setError(err.error || 'Falha no login. Verifique seu email e senha.');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // --- RENDERIZAÇÃO ---
    return (
        <Container fluid className={styles.pageWrapper}>
            <Row className="vh-100">
                <Col md={6} className={styles.leftPanel}>
                    <div className={styles.leftContent}>
                        <h1>Bem-vindo ao Portal Educacional</h1>
                        <p>Uma plataforma completa para avaliação do percurso formativo</p>
                    </div>
                </Col>

                <Col md={6} className={styles.rightPanel}>
                    <div className={styles.formContainer}>
                        <h3 className="text-center mb-4">{showRegister ? 'Cadastro' : 'Login'}</h3>

                        <Form onSubmit={handleSubmit}>
                            {/* ... (Todo o seu JSX de formulário permanece exatamente o mesmo) ... */}
                            {showRegister && (
                                <Form.Group className={`mb-3 ${styles.inputWithIcon}`}>
                                    <Form.Label>Nome</Form.Label>
                                    <div className={styles.iconInputWrapper}>
                                        <FaUser className={styles.inputIcon} />
                                        <Form.Control
                                            type="text" name="nome" value={formData.nome}
                                            onChange={handleChange} placeholder="Digite seu nome completo" required
                                        />
                                    </div>
                                </Form.Group>
                            )}
                            <Form.Group className={`mb-3 ${styles.inputWithIcon}`}>
                                <Form.Label>Email</Form.Label>
                                <div className={styles.iconInputWrapper}>
                                    <FaEnvelope className={styles.inputIcon} />
                                    <Form.Control
                                        type="email" name="email" value={formData.email}
                                        onChange={handleChange} placeholder="Digite seu email" required
                                    />
                                </div>
                            </Form.Group>
                            <Form.Group className={`mb-3 ${styles.inputWithIcon}`}>
                                <Form.Label>Senha</Form.Label>
                                <div className={styles.iconInputWrapper}>
                                    <FaLock className={styles.inputIcon} />
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        name="senha" value={formData.senha} onChange={handleChange}
                                        placeholder="Digite sua senha" required
                                    />
                                    <span className={styles.eyeIcon} onClick={togglePasswordVisibility}>
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </Form.Group>
                            {showRegister && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Perfil</Form.Label>
                                        <Form.Select name="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange}>
                                            <option value="aluno">Aluno</option>
                                            <option value="professor">Professor</option>
                                        </Form.Select>
                                    </Form.Group>
                                    {formData.tipo_usuario === 'aluno' && (
                                        <Form.Group className={`mb-3 ${styles.inputWithIcon}`}>
                                            <Form.Label>Número de Matrícula</Form.Label>
                                            <div className={styles.iconInputWrapper}>
                                                <FaIdCard className={styles.inputIcon} />
                                                <Form.Control
                                                    type="text" name="numero_matricula" value={formData.numero_matricula}
                                                    onChange={handleChange} placeholder="Ex: 20251001" required
                                                />
                                            </div>
                                        </Form.Group>
                                    )}
                                    {formData.tipo_usuario === 'professor' && (
                                        <Form.Group className={`mb-3 ${styles.inputWithIcon}`}>
                                            <Form.Label>Departamento</Form.Label>
                                            <div className={styles.iconInputWrapper}>
                                                <FaBuilding className={styles.inputIcon} />
                                                <Form.Control
                                                    type="text" name="departamento" value={formData.departamento}
                                                    onChange={handleChange} placeholder="Ex: Ciência da Computação"
                                                />
                                            </div>
                                        </Form.Group>
                                    )}
                                </>
                            )}
                            
                            {/* Exibição de Alertas */}
                            {error && <Alert variant="danger">{error}</Alert>}
                            {successMessage && <Alert variant="success">{successMessage}</Alert>}

                            <div className="d-grid">
                                <Button className={styles.customButton} type="submit" disabled={isLoading}>
                                    {isLoading ? 'Aguarde...' : (showRegister ? 'Cadastrar' : 'Entrar')}
                                </Button>
                            </div>

                            <p className="text-center mt-3">
                                {showRegister ? (
                                    <>Já tem uma conta?{' '}<span className={styles.toggleLink} onClick={toggleForm}>Entrar</span></>
                                ) : (
                                    <>Novo por aqui?{' '}<span className={styles.toggleLink} onClick={toggleForm}>Criar uma conta</span></>
                                )}
                            </p>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}