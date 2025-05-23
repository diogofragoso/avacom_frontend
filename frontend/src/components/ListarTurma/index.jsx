import { Card, Button, Badge, ProgressBar, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaChalkboardTeacher } from 'react-icons/fa';
import styles from './ListarTurma.module.css';
import { useState, useEffect } from 'react';
import cursoService from '../../services/cursoService';
import { NavLink as NavLink2 } from 'react-router-dom'; // Importação corrigida
import { useLocation } from 'react-router-dom'; // Importação corrigida

const turmas = [
    {
        nome: 'Turma A - Manhã',
        curso: 'Matemática Básica',
        turno: 'Manhã',
        dataInicio: '14/02/2024',
        ocupacaoAtual: 25,
        ocupacaoMax: 30
    },
    {
        nome: 'Turma B - Tarde',
        curso: 'Matemática Básica',
        turno: 'Tarde',
        dataInicio: '15/02/2024',
        ocupacaoAtual: 28,
        ocupacaoMax: 30
    },
    {
        nome: 'Turma A - Manhã',
        curso: 'História do Brasil',
        turno: 'Manhã',
        dataInicio: '19/02/2024',
        ocupacaoAtual: 30,
        ocupacaoMax: 35
    }
];

export default function ListarTurmas() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        curso: '',
        periodo: 'Manhã',
        maximoAlunos: ''
    });
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const data = await cursoService.getCursos();
                setCursos(data); // certifique-se de que o retorno é um array de objetos com { id, nome }
            } catch (error) {
                console.error('Erro ao carregar cursos:', error);
            }
        };

        fetchCursos();
    }, []);




    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSalvar = () => {
        console.log('Nova turma criada:', formData);
        handleClose();
    };

    return (
        <div className={`container mt-4 ${styles.containerCustom}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className={styles.title}><FaChalkboardTeacher className="me-2" /> Gerenciar Turmas</h2>
                <Button variant="success" onClick={handleShow}>+ Nova Turma</Button>
            </div>

            <div className="row">
                {turmas.map((turma, index) => {
                    const ocupacaoPercentual = (turma.ocupacaoAtual / turma.ocupacaoMax) * 100;
                    return (
                        <div key={index} className="col-md-4 mb-4">
                            <Card className={styles.card}>
                                <Card.Body>
                                    <Card.Title className={styles.cardTitle}>
                                        {turma.nome}
                                        <div>
                                            <FaEdit className={`${styles.icon} text-success me-2`} />
                                            <FaTrash className={`${styles.icon} text-danger`} />
                                        </div>
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2">
                                        📘 {turma.curso}
                                    </Card.Subtitle>
                                    <div className="mb-2">
                                        ⏰ <Badge bg={turma.turno === 'Manhã' ? 'warning' : 'secondary'} text="dark">
                                            {turma.turno}
                                        </Badge>
                                        <span className="ms-2">📅 {turma.dataInicio}</span>
                                    </div>
                                    <div>
                                        Ocupação: <strong>{turma.ocupacaoAtual}/{turma.ocupacaoMax} alunos</strong>
                                        <ProgressBar now={ocupacaoPercentual} className="mt-1" />
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    );
                })}
            </div>

            {/* Modal Nova Turma */}
            <Modal show={showModal} onHide={handleClose} centered backdrop="static" contentClassName={styles.modalDark}>
                <Modal.Header closeButton>
                    <Modal.Title>Criar Nova Turma</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome da Turma *</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                placeholder="Ex: Turma A - Manhã"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Select name="curso" value={formData.curso} onChange={handleChange}>
                            <option value="">Selecione um curso</option>                            
                            {cursos.map((curso) => (
                                <option key={curso.id} value={curso.nome_curso}>
                                    {curso.nome_curso}
                                    
                                </option>
                            ))}
                        </Form.Select>


                        <Form.Group className="mb-3">
                            <Form.Label>Período *</Form.Label>
                            <Form.Select
                                name="periodo"
                                value={formData.periodo}
                                onChange={handleChange}
                                required
                            >
                                <option>Manhã</option>
                                <option>Tarde</option>
                                <option>Noite</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Máximo de Alunos *</Form.Label>
                            <Form.Control
                                type="number"
                                name="maximoAlunos"
                                placeholder="Ex: 30"
                                value={formData.maximoAlunos}
                                onChange={handleChange}
                                required
                                min="1"
                                max="40"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="success" onClick={handleSalvar}>
                        Criar Turma
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
