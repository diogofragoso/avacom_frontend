import React, { useState } from 'react';
import styles from '../../styles/painel.module.css';
import { Outlet, useLocation } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';

import { Container, Nav, NavItem,   NavLink,Navbar } from 'react-bootstrap';
import ListarTurmas from '../../components/ListarTurma';

function PainelTurma() {
  const location = useLocation();
  const { curso } = location.state || {};  // Garantir que uc e curso serão obtidos corretamente, se passados

 

  return (
    <Container fluid className='px-0'>
      <div className={styles.paineluc}>

    <div>
        <div className='row'>
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
      <Nav tabs>
        <NavItem>    
                  <NavLink className={styles.navLink}>
                    <NavLink2 to="/PainelCurso/EditarCurso">                      
                     Cursos
                    </NavLink2>
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
                  <ListarTurmas />
                  <Outlet />
                </div>

          </div>

          </div>
            
      </div>
    </Container>
        
    
  );
}

export default PainelTurma;
