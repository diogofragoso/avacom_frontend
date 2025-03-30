import React, { useState } from 'react';
import styles from './PainelEstudante.module.css';
import { Outlet } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';

import { Nav, NavItem,   NavLink,Navbar } from 'react-bootstrap';

function PainelEstudante() {
 

  return (
      <div className={styles.painelestudante}>

    <div>
        <div className='row'>
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
      <Nav tabs>
        <NavItem>    
                  <NavLink className={styles.navLink}>
                    <NavLink2 to="RegistroEstudante">                      
                     Cadastrar
                    </NavLink2>
                    </NavLink>         
        </NavItem>
        <NavItem>    
                  <NavLink className={styles.navLink}>
                    <NavLink2 to="Contador">                      
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

export default PainelEstudante;
