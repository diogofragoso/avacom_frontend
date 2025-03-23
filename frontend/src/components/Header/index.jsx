import React from 'react';
import { Nav } from 'react-bootstrap'; // Importando o componente Nav do React-Bootstrap
import { NavLink } from 'react-router-dom'; // Usando NavLink do react-router-dom para roteamento
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o CSS do Bootstrap
import styles from './Header.module.css'; // Importando o CSS Module

function Header() {
    return (
        <div className={styles.header}>
            {/* Usando o componente Nav do React-Bootstrap */}
            <Nav className={styles.navItemCustom}>
                {/* Link para a página inicial */}
                <Nav.Link as={NavLink} to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
                    Home
                </Nav.Link>

                {/* Link para a página de avaliação */}
                <Nav.Link as={NavLink} to="/avaliar" className={({ isActive }) => (isActive ? styles.active : '')}>
                    Avaliar
                </Nav.Link>

                {/* Link para outra página */}
                <Nav.Link as={NavLink} to="/link" className={({ isActive }) => (isActive ? styles.active : '')}>
                    Link
                </Nav.Link>
            </Nav>
        </div>
    );
}

export default Header;