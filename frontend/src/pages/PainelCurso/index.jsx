import React, { useState } from 'react';
import styles from './PainelCurso.module.css';
import { Outlet } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';

import { Nav, NavItem,   NavLink,Navbar } from 'react-bootstrap';

function PainelCurso() {
 

  return (
      <div className={styles.painelcurso}>

    <div>
        <div className='row'>
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
      <Nav tabs>
        <NavItem>    
                  <NavLink className={styles.navLink}>
                    <NavLink2 to="RegistroCurso">                      
                     Cadastrar
                    </NavLink2>
                    </NavLink>         
        </NavItem>
        <NavItem>    
                  <NavLink className={styles.navLink}>
                    <NavLink2 to="EditarCurso">                      
                     Editar
                    </NavLink2>
                    </NavLink>         
        </NavItem>
                     
          </Nav>
        </Navbar>

          
          
          
                <div>
                  <Outlet />
                </div>

          </div>

          </div>
            
      </div>
        
    
  );
}

export default PainelCurso;
