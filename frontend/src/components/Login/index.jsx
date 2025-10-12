import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap'; // Adicionado Alert
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaIdCard, FaBuilding } from 'react-icons/fa'; // Ícones adicionados
import styles from './Login.module.css';
import usuarioService from '../../services/usuarioService'; // 👈 IMPORTANTE: ajuste o caminho para o seu service

export default function Login() {
    // --- ESTADOS ---
    const [showRegister, setShowRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // Estado para controlar os dados do formulário
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        tipo_usuario: 'aluno',
        numero_matricula: '',
        departamento: '',
    });

    // Estados para feedback ao usuário
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // ✨ 1. Adicionar estado para o sucesso

    // --- FUNÇÕES ---
    const toggleForm = () => {
        setShowRegister(!showRegister);
        setError(null); // Limpa erros ao trocar de formulário
        setSuccessMessage(null); // ✨ Limpa a mensagem de sucesso ao trocar
        // Reseta o formulário ao trocar
        setFormData({
            nome: '', email: '', senha: '', tipo_usuario: 'aluno',
            numero_matricula: '', departamento: ''
        });
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    // Atualiza o estado do formulário a cada mudança nos inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Lida com o envio do formulário (Login ou Cadastro)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o recarregamento da página
        setError(null);
        setSuccessMessage(null); // ✨ Limpa mensagens antigas
        setIsLoading(true);

        if (showRegister) {
            // --- LÓGICA DE CADASTRO ---
            try {
                const dadosParaEnviar = { ...formData };
                if (dadosParaEnviar.tipo_usuario === 'aluno') {
                    delete dadosParaEnviar.departamento;
                } else {
                    delete dadosParaEnviar.numero_matricula;
                }

                // Chama o serviço para criar o usuário
                const response = await usuarioService.criarUsuario(dadosParaEnviar);
                
                // ✨ 2. Substituir o alert() pela definição da mensagem de sucesso
                setSuccessMessage(response.message);
                
                // Adia o toggleForm para que a mensagem de sucesso seja visível
                setTimeout(() => {
                    toggleForm(); // Volta para a tela de login após o sucesso
                }, 3000); // 3 segundos de delay

            } catch (err) {
                // Captura o erro da API e exibe para o usuário
                setError(err.error || 'Não foi possível completar o cadastro.');
            } finally {
                setIsLoading(false);
            }
        } else {
            // --- LÓGICA DE LOGIN (A SER IMPLEMENTADA) ---
            alert('Funcionalidade de Login ainda não implementada.');
            // TODO: Chamar o service de login aqui
            setIsLoading(false);
        }
    };

    // --- RENDERIZAÇÃO ---
    return (
        <Container fluid className={styles.pageWrapper}>
            <Row className="vh-100">
                {/* Lado Esquerdo (sem alterações) */}
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

                        <Form onSubmit={handleSubmit}>
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
                            
                            {/* --- CAMPOS CONDICIONAIS DE CADASTRO --- */}
                            {showRegister && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Perfil</Form.Label>
                                        <Form.Select name="tipo_usuario" value={formData.tipo_usuario} onChange={handleChange}>
                                            <option value="aluno">Aluno</option>
                                            <option value="professor">Professor</option>
                                        </Form.Select>
                                    </Form.Group>

                                    {/* Campo para Aluno */}
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

                                    {/* Campo para Professor */}
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
                            
                            {/* Exibição de Erro */}
                            {error && <Alert variant="danger">{error}</Alert>}
                            {/* ✨ 3. Adicionar a renderização do Alert de sucesso */}
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