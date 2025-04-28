import React from 'react';
import styles from './Indicadores.module.css';
import { Outlet, useLocation } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';
import { Nav, NavItem, NavLink, Navbar } from 'react-bootstrap';
import ListarIndicadores from '../../components/ListarIndicadores';

function PainelIndicadores() {
  const location = useLocation();
  const { uc, curso } = location.state || {};  // Garantir que uc e curso serão obtidos corretamente, se passados

  
  if (!uc || !curso) {
    return <p>Erro: Dados de UC ou Curso não encontrados!</p>;  // Caso o estado não seja passado corretamente
  }

  return (
    <div className={styles.indicadores}>
      <div>
        <div className="row">
          <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
            <Nav tabs>
              <NavItem>
                <NavLink className={styles.navLink}>
                  <NavLink2 to="#">Cursos</NavLink2>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={styles.navLink}>
                  {/* Passando os parâmetros curso para a próxima rota */}
                  <NavLink2
                    to="/PainelUc/RegistroUc"
                    state={{
                      curso: {
                        nome_curso: curso,  // Verifique se 'curso?.nome_curso' é válido
                        id_curso: uc?.id_curso_fk,
                      },
                    }}
                  >
                    UCs
                  </NavLink2>
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
