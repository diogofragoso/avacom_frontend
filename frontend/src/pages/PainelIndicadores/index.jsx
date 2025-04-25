import React, { useState } from 'react';
import styles from './Indicadores.module.css';
import { Outlet } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';

import { Nav, NavItem,   NavLink,Navbar } from 'react-bootstrap';

function PainelIndicadores() {
 

  return (
      <div className={styles.indicadores}>

    <div>
        <div className='row'>
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
      <Nav tabs>
        <NavItem>    
                  <NavLink className={styles.navLink}>
                    <NavLink2 to="#">                      
                     Cadastrar Indicadores
                    </NavLink2>
                    </NavLink>         
        </NavItem>
        <NavItem>    
                  <NavLink className={styles.navLink}>
                    <NavLink2 to="ListarIndicadores">                      
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

export default PainelIndicadores;
