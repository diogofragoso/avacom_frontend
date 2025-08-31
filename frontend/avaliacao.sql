-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 31-Ago-2025 às 16:19
-- Versão do servidor: 10.4.27-MariaDB
-- versão do PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `avaliacao`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `aluno`
--

CREATE TABLE `aluno` (
  `id_aluno` int(11) NOT NULL,
  `nome_aluno` varchar(100) DEFAULT NULL,
  `email_aluno` varchar(100) DEFAULT NULL,
  `senha_aluno` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `aluno`
--

INSERT INTO `aluno` (`id_aluno`, `nome_aluno`, `email_aluno`, `senha_aluno`) VALUES
(2, 'Rhailan Fragoso Bastos', 'fragoso23rln@gmail.com', '9898989'),
(3, 'Diogo Fragoso da Silva', 'fragoso23rln@gmail.com', '56556'),
(4, 'Diogo Fragoso da Silva', 'fragoso23rln@gmail.com', 'senac'),
(5, 'Pedro', 'fragoso23rln@gmail.com', '121212'),
(6, 'Mario', 'diogofragoso@yahoo.com.br', 'senac'),
(7, 'Maria	', 'maria@gmail.com', '45646'),
(8, 'Pedro Pedreira', 'pedreira@gmail.com', 'sasasj'),
(9, 'Joana bananeira', 'joana@gmail.com', '1221'),
(10, 'Ana', 'ana@gmail.com', '1234'),
(11, 'Pedro Pedreira', 'diogofragoso@yahoo.com.br', 'senac'),
(12, 'Pedro Pedreira', 'fragoso23rln@gmail.com', '1234'),
(13, 'Natalia', 'fragoso23rln@gmail.com', '1234'),
(14, 'Nala Fragoso', 'nalinha@gmail.com', 'auau');

-- --------------------------------------------------------

--
-- Estrutura da tabela `atividade_avaliativa`
--

CREATE TABLE `atividade_avaliativa` (
  `id_avaliativa` int(11) NOT NULL,
  `descricao_avaliativa` varchar(100) NOT NULL,
  `id_indicador_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `atividade_avaliativa`
--

INSERT INTO `atividade_avaliativa` (`id_avaliativa`, `descricao_avaliativa`, `id_indicador_fk`) VALUES
(2, 'Realiza a instalação de sistemas', 2),
(13, 'Nesta atividade os aluno realizaram uma atividade avaliativa usando os servidores do laboratório 21\n', 2),
(15, 'Elabore uma atividade  avaliativa sobre configurar servidores linux ', 2),
(17, 'Configura servidores ', 2),
(18, 'Ajuste a funcao procv', 28);

-- --------------------------------------------------------

--
-- Estrutura da tabela `avaliacao`
--

CREATE TABLE `avaliacao` (
  `id_avaliacao` int(11) NOT NULL,
  `id_aluno_fk` int(11) DEFAULT NULL,
  `id_turma_fk` int(11) DEFAULT NULL,
  `id_at_avaliativa_fk` int(11) NOT NULL,
  `data_avaliacao` date DEFAULT NULL,
  `mencao` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `curso`
--

CREATE TABLE `curso` (
  `id_curso` int(11) NOT NULL,
  `nome_curso` varchar(100) DEFAULT NULL,
  `descricao_curso` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `curso`
--

INSERT INTO `curso` (`id_curso`, `nome_curso`, `descricao_curso`) VALUES
(1, 'Técnico em Informática', 'Formação técnica'),
(12, 'Excel', 'Excel avançado'),
(13, 'Farmácia', 'Técnicoi');

-- --------------------------------------------------------

--
-- Estrutura da tabela `indicador`
--

CREATE TABLE `indicador` (
  `id_indicador` int(11) NOT NULL,
  `numero_indicador` varchar(2) DEFAULT NULL,
  `descricao_indicador` varchar(100) NOT NULL,
  `id_uc_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `indicador`
--

INSERT INTO `indicador` (`id_indicador`, `numero_indicador`, `descricao_indicador`, `id_uc_fk`) VALUES
(2, '1', 'Instala sistemas operacionais', 1),
(12, '3', 'Atendimentos ao paciente', 18),
(14, '3', 'jhkhjkhjk', 1),
(15, '1', 'Verificar IMC', 32),
(17, '1', 'Seleciona o medicamento ', 27),
(20, '1', 'ihuhu', 1),
(25, '1', '90890898908', 2),
(26, '10', 'iuguiggyu', 1),
(27, '2', 'Configurar rede lan', 2),
(28, '1', 'Usa a função ProcV', 41);

-- --------------------------------------------------------

--
-- Estrutura da tabela `matricula`
--

CREATE TABLE `matricula` (
  `id_matricula` int(11) NOT NULL,
  `id_aluno_fk` int(11) NOT NULL,
  `id_turma_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `matricula`
--

INSERT INTO `matricula` (`id_matricula`, `id_aluno_fk`, `id_turma_fk`) VALUES
(1, 2, 1),
(3, 7, 1),
(4, 5, 1),
(5, 13, 1),
(10, 3, 21),
(11, 5, 21);

-- --------------------------------------------------------

--
-- Estrutura da tabela `turma`
--

CREATE TABLE `turma` (
  `id_turma` int(11) NOT NULL,
  `nome_turma` varchar(50) NOT NULL,
  `periodo_turma` varchar(10) NOT NULL,
  `max_aluno_turma` int(11) NOT NULL,
  `data_inicio_turma` date NOT NULL,
  `id_curso_fk` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `turma`
--

INSERT INTO `turma` (`id_turma`, `nome_turma`, `periodo_turma`, `max_aluno_turma`, `data_inicio_turma`, `id_curso_fk`) VALUES
(1, 'Técnico em informática - T1', 'Manhã', 30, '2024-11-11', 1),
(21, 'Técnico em informática - T1', 'Noite', 40, '2025-08-14', 1),
(22, 'Excel', 'Manhã', 20, '2025-08-08', 12);

-- --------------------------------------------------------

--
-- Estrutura da tabela `uc`
--

CREATE TABLE `uc` (
  `id_uc` int(11) NOT NULL,
  `nome_uc` varchar(100) NOT NULL,
  `numero_uc` int(11) NOT NULL,
  `id_curso_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `uc`
--

INSERT INTO `uc` (`id_uc`, `nome_uc`, `numero_uc`, `id_curso_fk`) VALUES
(1, 'Manutenção de Hardware5', 1, 1),
(2, 'Montagem', 2, 1),
(18, 'Atendimento ao cliente', 1, 13),
(19, 'Primeiro socorros', 2, 13),
(27, 'Aplicar injeção no bumbum', 4, 13),
(28, 'Configurar firewall', 3, 1),
(30, 'Configurar rede Lan', 10, 1),
(32, 'pesa paciente', 5, 13),
(33, 'Configurar zabbix', 11, 1),
(35, 'Configurar zabbix', 12, 1),
(36, 'Configurar zabbix', 4, 1),
(41, 'ProcV', 1, 12);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `aluno`
--
ALTER TABLE `aluno`
  ADD PRIMARY KEY (`id_aluno`);

--
-- Índices para tabela `atividade_avaliativa`
--
ALTER TABLE `atividade_avaliativa`
  ADD PRIMARY KEY (`id_avaliativa`),
  ADD KEY `id_indicador_fk` (`id_indicador_fk`);

--
-- Índices para tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD PRIMARY KEY (`id_avaliacao`),
  ADD KEY `id_aluno` (`id_aluno_fk`),
  ADD KEY `id_turma` (`id_turma_fk`),
  ADD KEY `id_at_avaliativa_fk` (`id_at_avaliativa_fk`);

--
-- Índices para tabela `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id_curso`);

--
-- Índices para tabela `indicador`
--
ALTER TABLE `indicador`
  ADD PRIMARY KEY (`id_indicador`),
  ADD KEY `id_uc_fk` (`id_uc_fk`);

--
-- Índices para tabela `matricula`
--
ALTER TABLE `matricula`
  ADD PRIMARY KEY (`id_matricula`),
  ADD KEY `id_aluno_fk` (`id_aluno_fk`),
  ADD KEY `id_turma_fk` (`id_turma_fk`);

--
-- Índices para tabela `turma`
--
ALTER TABLE `turma`
  ADD PRIMARY KEY (`id_turma`),
  ADD KEY `id_curso_fk` (`id_curso_fk`);

--
-- Índices para tabela `uc`
--
ALTER TABLE `uc`
  ADD PRIMARY KEY (`id_uc`),
  ADD KEY `id_curso_fk` (`id_curso_fk`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `aluno`
--
ALTER TABLE `aluno`
  MODIFY `id_aluno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `atividade_avaliativa`
--
ALTER TABLE `atividade_avaliativa`
  MODIFY `id_avaliativa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  MODIFY `id_avaliacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `curso`
--
ALTER TABLE `curso`
  MODIFY `id_curso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `indicador`
--
ALTER TABLE `indicador`
  MODIFY `id_indicador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de tabela `matricula`
--
ALTER TABLE `matricula`
  MODIFY `id_matricula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `turma`
--
ALTER TABLE `turma`
  MODIFY `id_turma` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de tabela `uc`
--
ALTER TABLE `uc`
  MODIFY `id_uc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `atividade_avaliativa`
--
ALTER TABLE `atividade_avaliativa`
  ADD CONSTRAINT `id_indicador_fk` FOREIGN KEY (`id_indicador_fk`) REFERENCES `indicador` (`id_indicador`);

--
-- Limitadores para a tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`id_aluno_fk`) REFERENCES `aluno` (`id_aluno`),
  ADD CONSTRAINT `avaliacao_ibfk_2` FOREIGN KEY (`id_turma_fk`) REFERENCES `turma` (`id_turma`),
  ADD CONSTRAINT `id_at_avaliativa_fk` FOREIGN KEY (`id_at_avaliativa_fk`) REFERENCES `atividade_avaliativa` (`id_avaliativa`);

--
-- Limitadores para a tabela `indicador`
--
ALTER TABLE `indicador`
  ADD CONSTRAINT `id_uc_fk` FOREIGN KEY (`id_uc_fk`) REFERENCES `uc` (`id_uc`);

--
-- Limitadores para a tabela `matricula`
--
ALTER TABLE `matricula`
  ADD CONSTRAINT `id_turma_fk` FOREIGN KEY (`id_turma_fk`) REFERENCES `turma` (`id_turma`);

--
-- Limitadores para a tabela `turma`
--
ALTER TABLE `turma`
  ADD CONSTRAINT `turma_ibfk_1` FOREIGN KEY (`id_curso_fk`) REFERENCES `curso` (`id_curso`);

--
-- Limitadores para a tabela `uc`
--
ALTER TABLE `uc`
  ADD CONSTRAINT `id_curso_fk` FOREIGN KEY (`id_curso_fk`) REFERENCES `curso` (`id_curso`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
