import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // Importando componentes do React-Bootstrap
import HeaderComponent from '../../components/Header';
import MenuLateral from '../../components/MenuLateral';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o CSS do Bootstrap
import styles from './Home.module.css'; // Importando o CSS Module

function Home() {
    // Estado para controlar o menu lateral
    const [collapsed, setCollapsed] = useState(false);

    // Função para alternar o estado de collapsed
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={styles.home}>
            {/* Usando o Container do React-Bootstrap */}
            <Container fluid className={styles.container}>
                {/* Header */}
                <Row>
                    <Col className={styles.navegacao}>
                        <HeaderComponent />
                    </Col>
                </Row>

                {/* Conteúdo principal */}
                <Row>
                    <Col xs="auto" className={styles.menuLateralCol}>
                        {/* Passando estado e função de alternância para o MenuLateral */}
                        <MenuLateral collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
                    </Col>

                    {/* Conteúdo dinâmico (Outlet) */}
                    <Col className={styles.contentCol}>
                        <div className={styles.contentWrapper}>
                            <Outlet />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Home;
