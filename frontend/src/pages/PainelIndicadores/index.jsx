import React, { useEffect, useState } from 'react';
import styles from './Indicadores.module.css';
import { Outlet, useLocation } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';
import { Nav, NavItem, NavLink, Navbar } from 'react-bootstrap';
import ListarIndicadores from '../../components/ListarIndicadores'; // <<< importa aqui
// import indicadorService from '../../services/indicadorService'; // ainda deixa para uso futuro

function PainelIndicadores() {
  const location = useLocation();
  const { uc } = location.state || {};

  return (
    <div className={styles.indicadores}>
      <div>
        <div className='row'>
          <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
            <Nav tabs>
              <NavItem>
                <NavLink className={styles.navLink}>
                  <NavLink2 to="#">Cadastrar Indicadores</NavLink2>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={styles.navLink}>
                  <NavLink2 to="ListarIndicadores">Editar</NavLink2>
                </NavLink>
              </NavItem>
            </Nav>
          </Navbar>

          <div className="mt-4">
            {uc ? (
              <>
                <h2>Indicadores da UC: {uc.nome_uc}</h2>
                <ListarIndicadores id_uc={uc.id_uc} /> {/* <<< usa seu componente aqui */}
              </>
            ) : (
              <p>Selecione uma UC para visualizar os indicadores.</p>
            )}
          </div>

          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PainelIndicadores;
