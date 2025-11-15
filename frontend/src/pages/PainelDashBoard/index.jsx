import React from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import NavPainel from '../../components/NavPainel';

function PainelDashBoard() {
  const navegacao = {
    linkNome1: 'Cursos',
    linkNome2: 'Estudantes',
    linkNome3: 'Turmas',
    link1: '/PainelCurso/EditarCurso',
    link2: '/PainelEstudante/RegistroEstudante',
    link3: '/PainelTurma/ListarTurma',
  };

  return (
    <div>
      <Container fluid className='px-0 mt-0'>
        <div className='row'>
          <p>&nbsp;</p>
        </div>
      </Container>
      <Outlet />
    </div>
  );
}

export default PainelDashBoard;
