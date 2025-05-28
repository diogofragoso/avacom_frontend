import React from 'react';
import styles from '../../styles/painel.module.css';
import { Outlet } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';

import { Container, Nav, NavItem, NavLink, Navbar } from 'react-bootstrap';
import ListarTurmas from '../../components/ListarTurma';

function NavPainel({ navegacao, curso }) {
  const linkNome1 = navegacao?.linkNome1 || ' Curso...';
  const link1 = navegacao?.link1 || '/PainelCurso/EditarCurso';

  const linkNome2 = navegacao?.linkNome2 || 'Estudante';
  const link2 = navegacao?.link2 || 'InserirEstudanteCurso';

  return (
    <Container fluid className="px-0">
      <div className={styles.painel}>
        <div className="row">
          <Navbar bg="dark" data-bs-theme="dark" expand="lg" className={styles.painel.navLink}>
            <Nav tabs>
              <NavItem>
                <NavLink className={styles.navLink}>
                  <NavLink2 to={link1}>
                    {linkNome1}
                  </NavLink2>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={styles.navLink}>
                  <NavLink2 to={link2} state={{ curso }}>
                    {linkNome2}
                  </NavLink2>
                </NavLink>
              </NavItem>
            </Nav>
          </Navbar>

          <div>
            <ListarTurmas />
            <Outlet />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default NavPainel;
