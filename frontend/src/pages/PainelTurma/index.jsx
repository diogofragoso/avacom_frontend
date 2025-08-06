import React from 'react';
import styles from '../../styles/painel.module.css';
import { Outlet, useLocation } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';
import { Container, Nav, NavItem, NavLink, Navbar } from 'react-bootstrap';
import ListarTurmas from '../../components/ListarTurma';

function PainelTurma() {
  const location = useLocation();
  const { curso } = location.state || {};

  // Verifica se estamos na página de gerenciamento de turma
  const estaGerenciandoTurma = location.pathname.includes('GerenciarTurma');

  return (
    <Container fluid className='px-0'>
      <div className={styles.paineluc}>
        <div className='row'>
          <Navbar bg="dark" data-bs-theme="dark" expand="lg">
            <Nav tabs>
              <NavItem>
                <NavLink className={styles.navLink}>
                  <NavLink2 to="/PainelCurso/EditarCurso">Cursos</NavLink2>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={styles.navLink}>
                  <NavLink2 to="InserirEstudanteCurso" state={{ curso }}>
                    Estudante
                  </NavLink2>
                </NavLink>
              </NavItem>
            </Nav>
          </Navbar>

          <div>
            {!estaGerenciandoTurma && <ListarTurmas />}
            <Outlet />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default PainelTurma;
