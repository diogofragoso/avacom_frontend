import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // Importando componentes do React-Bootstrap
import HeaderComponent from '../../components/Header';
import MenuLateral from '../../components/MenuLateral';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o CSS do Bootstrap
import styles from './Home.module.css'; // Importando o CSS Module

function Home() {
    return (
        <div className={styles.home}>
            {/* Usando o Container do React-Bootstrap */}
            <Container fluid>
                {/* Header */}
                <Row>
                    <Col>
                        <HeaderComponent />
                    </Col>
                </Row>

                {/* Conteúdo principal */}
                <Row>
                    {/* Menu Lateral */}
                    <Col xs={2} className={styles.menuLateralCol}>
                        <MenuLateral />
                    </Col>

                    {/* Conteúdo dinâmico (Outlet) */}
                    <Col className={styles.contentCol}>
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;