import React, { useState } from 'react';
import HeaderComponent from '../../components/Header';
import MenuLateral from '../../components/MenuLateral';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Home.module.css';

function Home() {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => setCollapsed(!collapsed);

    return (
        <>
            {/* Header continua Fixo (ele está "fora" do flex da home) */}
            <HeaderComponent />

            {/* Container FLEX que começa 60px abaixo do topo */}
            <div className={styles.home}>
                
                {/* Coluna 1: O Menu (ele empurra o conteúdo naturalmente) */}
                <MenuLateral 
                    collapsed={collapsed} 
                    toggleCollapsed={toggleCollapsed} 
                />

                {/* Coluna 2: O Conteúdo (ocupa o espaço que sobra) */}
                <div className={styles.mainContent}>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Home;