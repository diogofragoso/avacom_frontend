import React, { useEffect, useState } from 'react';
import styles from './Indicadores.module.css';
import { Outlet, useLocation } from 'react-router-dom';
import { NavLink as NavLink2 } from 'react-router-dom';
import { Nav, NavItem, NavLink, Navbar } from 'react-bootstrap';
import indicadorService from '../../services/indicadorService'; // import seu service de indicadores

function PainelIndicadores() {
  const location = useLocation();
  const { uc } = location.state || {}; // pega o uc enviado
  const [indicadores, setIndicadores] = useState([]);

  useEffect(() => {
    if (uc) {
      buscarIndicadores();
    }
  }, [uc]);

  const buscarIndicadores = async () => {
    try {
      const response = await indicadorService.getIndicadoresPorUc(uc.id_uc); // passando id_uc diretamente
      console.log('Indicadores recebidos:', response); // <-- Teste aqui
      setIndicadores(response); // ajusta conforme a resposta da sua API
    } catch (error) {
      console.error('Erro ao buscar indicadores:', error);
    }
  };

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
                {indicadores.length > 0 ? (
                  indicadores.map((indicador) => (
                    <div key={indicador.id_indicador} className="mb-3">
                      <strong>{indicador.numero_indicador}</strong> - {indicador.descricao_indicador}
                    </div>
                  ))
                ) : (
                  <p>Nenhum indicador encontrado para esta UC.</p>
                )}
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
