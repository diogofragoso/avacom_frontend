import React from 'react';
import { Outlet, useLocation, NavLink as NavLink2 } from 'react-router-dom';
import styles from '../../styles/painel.module.css'; // CSS do componente
import { Navbar, Nav } from 'react-bootstrap';
import ListarAvaliativa from '../../components/ListarAvaliativa';

function PainelAvaliativa() {
  const location = useLocation();
  const { indicador, uc } = location.state || {};  // Recebendo os dados via state

  console.log("Indicador recebido:", indicador);
  console.log("UC recebida:", uc);

  return (
    <div className={styles.painelavaliativa}>
      <div className="row">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand className="ms-3">Painel Avaliativa</Navbar.Brand>
          <Nav className="me-auto ms-3">
            <Nav.Link as={NavLink2} to="/CardAvaliativa" className={styles.navLink}>
              Indicadores
            </Nav.Link>
          </Nav>
        </Navbar>

        <div className="p-4">
          <ListarAvaliativa
          id_indicador={indicador}          
          uc={uc} // Passando o ID da UC  
          setFeedback={() => {}} // Função de feedback vazia, substitua conforme necessário
          onDeleteSuccess={() => {}} // Função de sucesso de exclusão vazia, substitua conforme necessário
          onEditSuccess={() => {}} // Função de sucesso de edição vazia, substitua conforme necessário
          />


          <Outlet context={{ indicador, uc }} /> {/* Passa dados para rotas filhas, se necessário */}
        </div>
      </div>
    </div>
  );
}

export default PainelAvaliativa;
