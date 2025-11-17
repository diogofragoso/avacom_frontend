import React, { useEffect, useState } from 'react';
import { Nav, Dropdown } from 'react-bootstrap'; 
import { NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Header.module.css';

import usuarioService from '../../services/usuarioService';

import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

function Header() {

    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        // Recupera o usuário salvo no localStorage
        const dados = usuarioService.getUsuario();
        if (dados) setUsuario(dados);
    }, []);

    const handleLogout = () => {
        usuarioService.logout();
        navigate('/');
    };

    return (
        <div className={styles.header}>
            
            {/* Navegação da esquerda */}
            <Nav className={styles.navItemCustom}>
                <Nav.Link as={NavLink} to="#" className={({ isActive }) => (isActive ? styles.active : '')}>
                    Home
                </Nav.Link>

                <Nav.Link as={NavLink} to="#" className={({ isActive }) => (isActive ? styles.active : '')}>
                    Avaliar
                </Nav.Link>

                <Nav.Link as={NavLink} to="#" className={({ isActive }) => (isActive ? styles.active : '')}>
                    Link
                </Nav.Link>
            </Nav>

            {/* Área da direita: dropdown + logout */}
            <div className={styles.rightArea}>

                {/* DROPDOWN DE USUÁRIO */}
                <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className={styles.userToggle}>
                        <FaUserCircle className={styles.userIcon} />
                        <span className={styles.nomeUsuario}>{usuario?.nome ?? 'Usuário'}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => navigate('#')}>
                            Meu Perfil
                        </Dropdown.Item>

                        <Dropdown.Item onClick={() => navigate('#')}>
                            Configurações
                        </Dropdown.Item>

                        <Dropdown.Divider />

                        <Dropdown.Item className={styles.sair} onClick={handleLogout}>
                            Sair <FaSignOutAlt />
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

            </div>
        </div>
    );
}

export default Header;
