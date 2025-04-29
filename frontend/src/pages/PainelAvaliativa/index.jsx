import React from 'react';
import styles from './PainelAvaliativa.module.css'; // Atualizado para PainelAvaliativa.module.css
import { Outlet, useLocation } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';
import styles from '../../styles/painel.module.css'; // Importando o CSS do componente PainelAvaliativa



import { Nav, NavItem, NavLink, Navbar } from 'react-bootstrap';

function PainelAvaliativa() {
  const location = useLocation();
  const { indicador } = location.state || {};  // Pegando o indicador passado pela navegação

  return (
    <div className={styles.painelavaliativa}>
      <div className="row">
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
          <Nav tabs>
            <NavItem>
              <NavLink className={styles.navLink}>
                <NavLink2 to="/CardAvaliativa">
                  Indicadores
                </NavLink2>
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>

        <div>
        
          <Outlet /> {/* Aqui serão renderizadas as rotas filhas */}


        </div>
      </div>
    </div>
  );
}

export default PainelAvaliativa;
