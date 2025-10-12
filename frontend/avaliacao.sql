-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 12/10/2025 às 16:52
-- Versão do servidor: 10.11.13-MariaDB-0ubuntu0.24.04.1
-- Versão do PHP: 8.3.6

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
-- Estrutura para tabela `aluno`
--

CREATE TABLE `aluno` (
  `id_aluno` int(11) NOT NULL,
  `nome_aluno` varchar(100) DEFAULT NULL,
  `email_aluno` varchar(100) DEFAULT NULL,
  `senha_aluno` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `aluno`
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
(14, 'Nala Fragoso', 'nalinha@gmail.com', 'auau'),
(15, 'Eleonora ', 'leninha@hotmail.com', '123'),
(16, 'Joao Vitor', 'joao@gmail.com', '1234'),
(17, 'Julio', 'julio@gmail.com', '123456'),
(18, 'Maria Joaquina', 'maria@gmail.com', '123456'),
(19, 'Marcio Pedreira', 'marcio@gmail.com', '123456'),
(20, 'Richard', 'richard@gmail.com', 'senac1234');

-- --------------------------------------------------------

--
-- Estrutura para tabela `atividade_avaliativa`
--

CREATE TABLE `atividade_avaliativa` (
  `id_avaliativa` int(11) NOT NULL,
  `descricao_avaliativa` varchar(2000) NOT NULL,
  `id_indicador_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `atividade_avaliativa`
--

INSERT INTO `atividade_avaliativa` (`id_avaliativa`, `descricao_avaliativa`, `id_indicador_fk`) VALUES
(13, 'Nesta atividade os aluno realizaram uma atividade avaliativa usando os servidores do laboratório 25\n', 2),
(15, 'Elabore uma atividade  avaliativa sobre configurar servidores linux ', 2),
(22, 'Atividade avaliativa: Teste prático de instalação e configuração', 2),
(23, 'Analisa e interpreta receituários de acordo com legislação vigente e sob orientação do farmacêutico.', 12),
(24, 'Simulação de atendimento com base na Portaria 344/98', 12),
(25, 'Identificação de resíduos gerados em atendimentos de emergência e classificação para descarte', 43),
(26, 'Atividae prática. Administrar remédio via intravenosa. ', 36),
(27, 'O estudante recebe uma bancada com todas as caixas dos componentes necessários para montar um computador desktop funcional. A tarefa é realizar a montagem completa, desde a abertura das embalagens até o primeiro boot bem-sucedido, onde o sistema consegue aceder ao BIOS/UEFI.\n\nO avaliador observará todo o processo, focando nos procedimentos técnicos,', 38),
(29, 'Teste de avaliativa', 29),
(30, 'Teste avaliativa - I2', 25),
(31, 'O estudante receberá um computador de bancada (desktop) e um módulo de memória RAM novo em sua embalagem antiestática. A tarefa consiste em realizar a instalação (ou substituição) deste módulo de memória na placa-mãe do computador, aplicando todas as medidas de segurança necessárias contra descargas eletrostáticas.', 14),
(32, 'O estudante assume o papel de um técnico de manutenção. Ele recebe uma \"Ordem de Serviço\" descrevendo um problema em um computador desktop. O computador foi preparado pelo avaliador com um ou mais componentes defeituosos ou mal configurados.', 20),
(33, 'O estudante recebe um computador recém-montado, com o sistema operacional (ex: Windows 10/11) já instalado, mas sem nenhuma configuração fina ou otimização realizada. A memória RAM está operando em sua velocidade padrão (JEDEC), a ordem de boot pode não estar otimizada e drivers essenciais (como chipset e vídeo) não foram instalados.', 31),
(34, 'Ao final desta atividade, o estudante deverá ser capaz de:\n\nAcessar a interface de configuração do BIOS/UEFI de forma consistente.\n\nIdentificar e alterar a ordem de prioridade dos dispositivos de boot (Ex: SSD, HDD, Pendrive USB, Rede).\n\nHabilitar ou desabilitar o modo \"Secure Boot\" de acordo com a necessidade do cenário.\n\nAtivar ou desativar opções de inicialização rápida (Fast Boot).\n\nConfigurar a data e a hora do sistema diretamente no BIOS/UEFI.\n\n', 45),
(35, 'O estudante recebe um computador que acabou de passar por um serviço de montagem ou manutenção. Ele assume o papel do técnico responsável pela \"Liberação de Qualidade\". Sua tarefa é usar um Checklist de Inspeção Final para verificar minuciosamente o equipamento e garantir que não há pendências ou problemas.\n\nO avaliador terá preparado o computador com 2 ou 3 \"erros\" sutis e não-críticos para que o estudante os identifique.', 47),
(36, 'O estudante deve configurar um roteador stub', 48);

-- --------------------------------------------------------

--
-- Estrutura para tabela `avaliacao`
--

CREATE TABLE `avaliacao` (
  `id_avaliacao` int(11) NOT NULL,
  `id_aluno_fk` int(11) DEFAULT NULL,
  `id_turma_fk` int(11) NOT NULL,
  `id_at_avaliativa_fk` int(11) NOT NULL,
  `id_indicador_fk` int(11) NOT NULL,
  `data_avaliacao` date DEFAULT NULL,
  `mencao` varchar(20) DEFAULT NULL,
  `observacao_avaliacao` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `avaliacao`
--

INSERT INTO `avaliacao` (`id_avaliacao`, `id_aluno_fk`, `id_turma_fk`, `id_at_avaliativa_fk`, `id_indicador_fk`, `data_avaliacao`, `mencao`, `observacao_avaliacao`) VALUES
(34, 2, 1, 13, 2, NULL, NULL, NULL),
(35, 4, 1, 13, 2, NULL, NULL, NULL),
(36, 15, 1, 13, 2, NULL, NULL, NULL),
(37, 16, 1, 13, 2, NULL, NULL, NULL),
(38, 8, 1, 13, 2, NULL, NULL, NULL),
(39, 3, 1, 13, 2, NULL, NULL, NULL),
(58, 2, 1, 15, 2, NULL, 'A', 'oioiiooiuio'),
(59, 4, 1, 15, 2, NULL, 'NA', 'TESTE OBS'),
(60, 15, 1, 15, 2, NULL, 'A', NULL),
(61, 16, 1, 15, 2, NULL, NULL, NULL),
(62, 8, 1, 15, 2, NULL, NULL, NULL),
(63, 3, 1, 15, 2, NULL, 'A', 'O estudante foi muito bem nesta atividade'),
(76, 2, 23, 23, 12, NULL, NULL, NULL),
(77, 15, 23, 23, 12, NULL, NULL, NULL),
(111, 2, 23, 24, 12, NULL, NULL, NULL),
(112, 15, 23, 24, 12, NULL, NULL, NULL),
(121, 2, 1, 31, 14, NULL, 'A', NULL),
(122, 4, 1, 31, 14, NULL, 'A', NULL),
(123, 15, 1, 31, 14, NULL, NULL, NULL),
(124, 16, 1, 31, 14, NULL, NULL, NULL),
(125, 8, 1, 31, 14, NULL, NULL, NULL),
(126, 3, 1, 31, 14, NULL, 'A', NULL),
(127, 5, 1, 31, 14, NULL, NULL, NULL),
(128, 6, 1, 31, 14, NULL, NULL, NULL),
(137, 2, 1, 32, 20, NULL, 'A', NULL),
(138, 4, 1, 32, 20, NULL, 'A', NULL),
(139, 15, 1, 32, 20, NULL, NULL, NULL),
(140, 16, 1, 32, 20, NULL, NULL, NULL),
(141, 8, 1, 32, 20, NULL, NULL, NULL),
(142, 3, 1, 32, 20, NULL, 'A', NULL),
(143, 5, 1, 32, 20, NULL, NULL, NULL),
(144, 6, 1, 32, 20, NULL, NULL, NULL),
(145, 2, 1, 33, 31, NULL, 'NA', '´plplp'),
(146, 4, 1, 33, 31, NULL, 'NA', 'O estudante não entregou a atividade avaliativa'),
(147, 15, 1, 33, 31, NULL, NULL, NULL),
(148, 16, 1, 33, 31, NULL, NULL, NULL),
(149, 8, 1, 33, 31, NULL, NULL, NULL),
(150, 3, 1, 33, 31, NULL, 'A', NULL),
(151, 5, 1, 33, 31, NULL, NULL, NULL),
(152, 6, 1, 33, 31, NULL, NULL, NULL),
(153, 2, 1, 27, 38, NULL, 'A', NULL),
(154, 4, 1, 27, 38, NULL, 'A', NULL),
(155, 15, 1, 27, 38, NULL, NULL, NULL),
(156, 16, 1, 27, 38, NULL, NULL, NULL),
(157, 8, 1, 27, 38, NULL, NULL, NULL),
(158, 3, 1, 27, 38, NULL, NULL, NULL),
(159, 5, 1, 27, 38, NULL, NULL, NULL),
(160, 6, 1, 27, 38, NULL, NULL, NULL),
(185, 2, 1, 34, 45, NULL, 'A', NULL),
(186, 4, 1, 34, 45, NULL, 'A', 'O estudante demonstrou autonomia '),
(187, 15, 1, 34, 45, NULL, NULL, NULL),
(188, 16, 1, 34, 45, NULL, NULL, NULL),
(189, 8, 1, 34, 45, NULL, NULL, NULL),
(190, 3, 1, 34, 45, NULL, NULL, NULL),
(191, 5, 1, 34, 45, NULL, NULL, NULL),
(192, 6, 1, 34, 45, NULL, NULL, NULL),
(193, 2, 1, 35, 47, NULL, 'A', 'O estudante foi destaque nesta atividade.'),
(194, 4, 1, 35, 47, NULL, 'A', NULL),
(195, 15, 1, 35, 47, NULL, NULL, NULL),
(196, 16, 1, 35, 47, NULL, NULL, NULL),
(197, 8, 1, 35, 47, NULL, NULL, NULL),
(198, 3, 1, 35, 47, NULL, NULL, NULL),
(199, 5, 1, 35, 47, NULL, NULL, NULL),
(200, 6, 1, 35, 47, NULL, NULL, NULL),
(217, 4, 1, 30, 25, NULL, 'A', NULL),
(218, 15, 1, 30, 25, NULL, NULL, NULL),
(219, 16, 1, 30, 25, NULL, NULL, NULL),
(220, 8, 1, 30, 25, NULL, NULL, NULL),
(221, 3, 1, 30, 25, NULL, NULL, NULL),
(222, 5, 1, 30, 25, NULL, NULL, NULL),
(223, 6, 1, 30, 25, NULL, NULL, NULL),
(251, 4, 1, 29, 29, NULL, 'A', NULL),
(252, 15, 1, 29, 29, NULL, NULL, NULL),
(253, 16, 1, 29, 29, NULL, NULL, NULL),
(254, 8, 1, 29, 29, NULL, NULL, NULL),
(255, 3, 1, 29, 29, NULL, NULL, NULL),
(256, 5, 1, 29, 29, NULL, NULL, NULL),
(257, 6, 1, 29, 29, NULL, NULL, NULL),
(258, 2, 1, 29, 29, NULL, NULL, NULL),
(259, 7, 1, 29, 29, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `curso`
--

CREATE TABLE `curso` (
  `id_curso` int(11) NOT NULL,
  `nome_curso` varchar(100) DEFAULT NULL,
  `descricao_curso` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `curso`
--

INSERT INTO `curso` (`id_curso`, `nome_curso`, `descricao_curso`) VALUES
(1, 'Técnico em Informática', 'Formação técnica'),
(13, 'Farmácia', 'Técnicoi');

-- --------------------------------------------------------

--
-- Estrutura para tabela `indicador`
--

CREATE TABLE `indicador` (
  `id_indicador` int(11) NOT NULL,
  `numero_indicador` varchar(2) DEFAULT NULL,
  `descricao_indicador` varchar(300) NOT NULL,
  `id_uc_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `indicador`
--

INSERT INTO `indicador` (`id_indicador`, `numero_indicador`, `descricao_indicador`, `id_uc_fk`) VALUES
(2, '1', 'Descreve as funcionalidades e aplicações da arquitetura de computadores, de acordo com as orientações técnicas do fabricante.', 1),
(12, '1', 'Atendimentos ao paciente', 18),
(14, '2', 'Utiliza medidas de prevenção contra descargas eletrostáticas, de acordo com as orientações do fabricante.', 1),
(15, '1', 'Verificar IMC', 32),
(17, '1', 'Seleciona o medicamento ', 27),
(20, '3', 'Testa componentes de computadores e periféricos, de acordo com as recomendações técnicas.', 1),
(25, '1', '90890898908', 2),
(27, '2', 'Configurar rede lan', 2),
(29, '1', 'TESTE1', 28),
(30, '2', 'Teste 3', 28),
(31, '4', 'Configura os componentes do computador conforme recomendações técnicas.', 1),
(32, '3', 'Teste 3', 2),
(33, '4', 'Teste 4', 2),
(34, '5', 'Teste 5', 2),
(35, '1', 'Teste 1', 30),
(36, '2', 'Teste 2', 18),
(37, '3', 'Teste 3', 18),
(38, '5', 'Monta computadores conforme as recomendações e os procedimentos técnicos de fabricantes.', 1),
(39, '1', 'Teste 1', 33),
(40, '2', 'Teste 2', 33),
(41, '2', 'Teste 2', 30),
(42, '3', 'Teste 3 ', 30),
(43, '1', 'Gerencia descarte de resíduos em saúde provenientes de atendimento', 19),
(45, '6', 'Configura os parâmetros de inicialização da máquina conforme recomendações técnicas.', 1),
(46, '3', 'Teste 3', 28),
(47, '7', 'Realiza inspeção final do equipamento conforme recomendações técnicas.', 1),
(48, '1', 'Configuração de roteador cisco', 35);

-- --------------------------------------------------------

--
-- Estrutura para tabela `matricula`
--

CREATE TABLE `matricula` (
  `id_matricula` int(11) NOT NULL,
  `id_aluno_fk` int(11) NOT NULL,
  `id_turma_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `matricula`
--

INSERT INTO `matricula` (`id_matricula`, `id_aluno_fk`, `id_turma_fk`) VALUES
(10, 3, 21),
(11, 5, 21),
(20, 2, 23),
(42, 4, 1),
(44, 15, 23),
(45, 15, 1),
(46, 16, 1),
(48, 8, 1),
(49, 3, 1),
(50, 2, 27),
(51, 6, 27),
(52, 5, 1),
(53, 6, 1),
(54, 2, 1),
(55, 7, 1),
(56, 18, 1),
(57, 19, 1),
(58, 20, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `professor`
--

CREATE TABLE `professor` (
  `id_usuario_fk` int(11) NOT NULL,
  `departamento` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `professor`
--

INSERT INTO `professor` (`id_usuario_fk`, `departamento`) VALUES
(2, 'Ciência da computação'),
(3, 'Administração'),
(4, 'Administração');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tipo_usuario`
--

CREATE TABLE `tipo_usuario` (
  `id_tipo_usuario` int(11) NOT NULL,
  `tipo_user` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tipo_usuario`
--

INSERT INTO `tipo_usuario` (`id_tipo_usuario`, `tipo_user`) VALUES
(1, 'Aluno'),
(2, 'Professor');

-- --------------------------------------------------------

--
-- Estrutura para tabela `turma`
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
-- Despejando dados para a tabela `turma`
--

INSERT INTO `turma` (`id_turma`, `nome_turma`, `periodo_turma`, `max_aluno_turma`, `data_inicio_turma`, `id_curso_fk`) VALUES
(1, 'Técnico em informática - T1', 'Manhã', 30, '2024-11-11', 1),
(21, 'Técnico em informática - T2', 'Manhã', 40, '2025-08-14', 1),
(23, 'Farmácia - T1', 'Manhã', 30, '2025-09-07', 13),
(27, 'Técnico em informática - T3', 'Tarde', 30, '2025-09-04', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `uc`
--

CREATE TABLE `uc` (
  `id_uc` int(11) NOT NULL,
  `nome_uc` varchar(300) NOT NULL,
  `numero_uc` int(11) NOT NULL,
  `id_curso_fk` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `uc`
--

INSERT INTO `uc` (`id_uc`, `nome_uc`, `numero_uc`, `id_curso_fk`) VALUES
(1, 'Planejar e executar a montagem de computadores.', 1, 1),
(2, 'Planejar e executar a instalação de hardware e software para computadores.', 2, 1),
(18, 'Atendimento ao cliente', 1, 13),
(19, 'Primeiro socorros', 2, 13),
(27, 'Aplicar injeção no bumbum', 4, 13),
(28, 'Planejar e executar a manutenção de computadores.', 3, 1),
(30, '4: Projeto Integrador Assistente de Suporte e Manutenção de Computadores', 4, 1),
(32, 'pesa paciente', 5, 13),
(33, 'Planejar e executar a instalação de redes locais de computadores.', 5, 1),
(35, 'Planejar e executar a manutenção de redes locais de computadores.', 6, 1),
(43, 'Planejar e executar a instalação, a configuração e o monitoramento de sistemas operacionais de redes locais (servidores).', 7, 1),
(44, '8: Projeto Integrador Assistente de Operação de Redes de Computadores', 8, 1),
(45, 'Desenvolver Algoritmos.', 9, 1),
(46, 'Desenvolver banco de dados.', 10, 1),
(47, 'Executar teste e implantação de aplicativos computacionais.', 11, 1),
(48, 'Executar os processos de codificação, manutenção e documentação de aplicativos computacionais para desktop.', 12, 1),
(49, 'Executar os processos de codificação, manutenção e documentação de aplicativos computacionais para internet.', 13, 1),
(50, 'Manipular e otimizar imagens vetoriais, bitmaps gráficos e elementos visuais de navegação para web.', 14, 1),
(51, 'Desenvolver e organizar elementos estruturais de sites.', 15, 1),
(52, 'Projeto Integrador Assistente de Desenvolvimento de Aplicativos Computacionais', 16, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome_usuario` varchar(255) NOT NULL,
  `email_usuario` varchar(255) NOT NULL,
  `senha_usuario` varchar(255) NOT NULL,
  `tipo_usuario_fk` int(11) NOT NULL,
  `data_cadastro_usuario` datetime NOT NULL,
  `ativo_usuario` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome_usuario`, `email_usuario`, `senha_usuario`, `tipo_usuario_fk`, `data_cadastro_usuario`, `ativo_usuario`) VALUES
(2, 'Diogo Fragoso da Silva', 'diogofragoso@yahoo.com.br', '$2b$10$ucqi6qGyHHmSzUYik.uwNOoFPlxrho3rKz4l7S80Ps9O5qrcB7bnq', 2, '2025-10-12 16:27:54', 1),
(3, 'Maria Joaquina', 'mariajoaquina@gmail.com', '$2b$10$qKuTNFey2Z9fDVQyySTFDev5NO8rVaAGnPyra6bacriB8tXKLPNuO', 2, '2025-10-12 16:39:46', 1),
(4, 'Zequinha ', 'zeca@gmail.com', '$2b$10$ENexrmGSlm/pGQI9S0tH5eww5TYB8YVmbdKm8hDmmP3RlDV7OppNa', 2, '2025-10-12 16:49:18', 1);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aluno`
--
ALTER TABLE `aluno`
  ADD PRIMARY KEY (`id_aluno`);

--
-- Índices de tabela `atividade_avaliativa`
--
ALTER TABLE `atividade_avaliativa`
  ADD PRIMARY KEY (`id_avaliativa`),
  ADD KEY `id_indicador_fk` (`id_indicador_fk`);

--
-- Índices de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD PRIMARY KEY (`id_avaliacao`),
  ADD UNIQUE KEY `UQ_aluno_avaliativa` (`id_aluno_fk`,`id_at_avaliativa_fk`),
  ADD KEY `id_aluno` (`id_aluno_fk`),
  ADD KEY `id_turma` (`id_turma_fk`),
  ADD KEY `id_at_avaliativa_fk` (`id_at_avaliativa_fk`),
  ADD KEY `id_at_indicador_fk` (`id_indicador_fk`);

--
-- Índices de tabela `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id_curso`);

--
-- Índices de tabela `indicador`
--
ALTER TABLE `indicador`
  ADD PRIMARY KEY (`id_indicador`),
  ADD KEY `id_uc_fk` (`id_uc_fk`);

--
-- Índices de tabela `matricula`
--
ALTER TABLE `matricula`
  ADD PRIMARY KEY (`id_matricula`),
  ADD KEY `id_aluno_fk` (`id_aluno_fk`),
  ADD KEY `id_turma_fk` (`id_turma_fk`);

--
-- Índices de tabela `professor`
--
ALTER TABLE `professor`
  ADD PRIMARY KEY (`id_usuario_fk`);

--
-- Índices de tabela `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  ADD PRIMARY KEY (`id_tipo_usuario`);

--
-- Índices de tabela `turma`
--
ALTER TABLE `turma`
  ADD PRIMARY KEY (`id_turma`),
  ADD KEY `id_curso_fk` (`id_curso_fk`);

--
-- Índices de tabela `uc`
--
ALTER TABLE `uc`
  ADD PRIMARY KEY (`id_uc`),
  ADD KEY `id_curso_fk` (`id_curso_fk`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email_usuario`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `aluno`
--
ALTER TABLE `aluno`
  MODIFY `id_aluno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `atividade_avaliativa`
--
ALTER TABLE `atividade_avaliativa`
  MODIFY `id_avaliativa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  MODIFY `id_avaliacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=273;

--
-- AUTO_INCREMENT de tabela `curso`
--
ALTER TABLE `curso`
  MODIFY `id_curso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `indicador`
--
ALTER TABLE `indicador`
  MODIFY `id_indicador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de tabela `matricula`
--
ALTER TABLE `matricula`
  MODIFY `id_matricula` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de tabela `tipo_usuario`
--
ALTER TABLE `tipo_usuario`
  MODIFY `id_tipo_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `turma`
--
ALTER TABLE `turma`
  MODIFY `id_turma` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de tabela `uc`
--
ALTER TABLE `uc`
  MODIFY `id_uc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `atividade_avaliativa`
--
ALTER TABLE `atividade_avaliativa`
  ADD CONSTRAINT `id_indicador_fk` FOREIGN KEY (`id_indicador_fk`) REFERENCES `indicador` (`id_indicador`);

--
-- Restrições para tabelas `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`id_aluno_fk`) REFERENCES `aluno` (`id_aluno`),
  ADD CONSTRAINT `avaliacao_ibfk_2` FOREIGN KEY (`id_turma_fk`) REFERENCES `turma` (`id_turma`),
  ADD CONSTRAINT `id_at_avaliativa_fk` FOREIGN KEY (`id_at_avaliativa_fk`) REFERENCES `atividade_avaliativa` (`id_avaliativa`),
  ADD CONSTRAINT `id_at_indicador_fk` FOREIGN KEY (`id_indicador_fk`) REFERENCES `indicador` (`id_indicador`);

--
-- Restrições para tabelas `indicador`
--
ALTER TABLE `indicador`
  ADD CONSTRAINT `id_uc_fk` FOREIGN KEY (`id_uc_fk`) REFERENCES `uc` (`id_uc`);

--
-- Restrições para tabelas `matricula`
--
ALTER TABLE `matricula`
  ADD CONSTRAINT `id_turma_fk` FOREIGN KEY (`id_turma_fk`) REFERENCES `turma` (`id_turma`);

--
-- Restrições para tabelas `professor`
--
ALTER TABLE `professor`
  ADD CONSTRAINT `fk_professor_usuario` FOREIGN KEY (`id_usuario_fk`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `turma`
--
ALTER TABLE `turma`
  ADD CONSTRAINT `turma_ibfk_1` FOREIGN KEY (`id_curso_fk`) REFERENCES `curso` (`id_curso`);

--
-- Restrições para tabelas `uc`
--
ALTER TABLE `uc`
  ADD CONSTRAINT `id_curso_fk` FOREIGN KEY (`id_curso_fk`) REFERENCES `curso` (`id_curso`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
