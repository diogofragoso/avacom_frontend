import React, { useState, useEffect } from 'react'; // 1. Importe o useEffect
import { Alert } from 'react-bootstrap';
import estudanteService from '../../services/estudanteService';

import styles from './RegistroEstudante.module.css'; 

const RegistroEstudante = () => {
  const [formData, setFormData] = useState({
    nome_aluno: '',
    email_aluno: '',
    senha_aluno: ''
  });

  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // 2. Adicione este bloco useEffect
  useEffect(() => {
    // Se existe uma mensagem no feedback...
    if (feedback.message) {
      // Cria um temporizador para limpar o feedback após 1 segundo
      const timer = setTimeout(() => {
        setFeedback({ type: '', message: '' });
      }, 1000); // 1000ms = 1 segundo

      // Função de limpeza: se o componente for desmontado, o timer é cancelado
      return () => clearTimeout(timer);
    }
  }, [feedback]); // O hook vai rodar toda vez que o estado 'feedback' mudar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await estudanteService.createStudent(formData);
      setFeedback({ type: 'success', message: 'Estudante inserido com sucesso!' });
      setFormData({ nome_aluno: '', email_aluno: '', senha_aluno: '' });
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      setFeedback({ type: 'danger', message: 'Erro ao cadastrar aluno: ' + error.message });
    }
  };

  return (
    <div className={styles.registroEstudante}>
      
      {/* Coluna da Esquerda: Formulário */}
      <div className={styles.formContainer}>
        <div className={styles.formLogo}>
           {/* Ícone de exemplo */}
           🎓
        </div>
        <h2>Cadastro de Estudante</h2>

        {/* Feedback para o usuário (NENHUMA MUDANÇA AQUI) */}
        {feedback.message && (
          <Alert variant={feedback.type} onClose={() => setFeedback({ type: '', message: '' })} dismissible className={styles.feedbackAlert}>
            {feedback.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="nome_aluno">Nome Completo</label>
            <input
              type="text"
              id="nome_aluno"
              name="nome_aluno"
              placeholder="Digite seu nome completo"
              value={formData.nome_aluno}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email_aluno">Email</label>
            <input
              type="email"
              id="email_aluno"
              name="email_aluno"
              placeholder="seu@email.com"
              value={formData.email_aluno}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="senha_aluno">Senha</label>
            <input
              type="password"
              id="senha_aluno"
              name="senha_aluno"
              placeholder="Mínimo 6 caracteres"
              value={formData.senha_aluno}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Cadastrar
          </button>
        </form>
      </div>

      {/* Coluna da Direita: Ilustração */}
      <div className={styles.illustrationContainer}>
        {/* Adicione sua imagem ou ilustração aqui */}
        {/* Ex: <img src="/ilustracao.svg" alt="Ilustração" className={styles.illustrationImage} /> */}
      </div>

    </div>
  );
};

export default RegistroEstudante;