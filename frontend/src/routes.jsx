import {HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Tarefas from "./pages/Tarefas";
import Contador from "./pages/Contador";
import RegistroEstudante from "./pages/RegistroEstudante";
import PainelEstudante from "./pages/PainelEstudante";
import PainelCurso from "./pages/PainelCurso";
import RegistroCurso from "./components/RegistroCurso";
import EditarCurso from "./components/EditarCurso";
import RegistroUc from "./components/RegistroUc";
import PainelUc from "./pages/PainelUc";
import PainelIndicadores from "./pages/PainelIndicadores";
import ListarIndicadores from "./components/ListarIndicadores";
import ListarAvaliativa from "./components/ListarAvaliativa";
import PainelAvaliativa from "./pages/PainelAvaliativa";
import InserirEstudanteCurso from "./components/InserirEstudanteCurso";
import Login from "./components/Login";
import PainelTurma from "./pages/PainelTurma";
import ListarTurmas from "./components/ListarTurma";
import NavPainel from "./components/NavPainel";
import PainelDashBoard from "../src/pages/PainelDashBoard";
import GerenciarTurma from "./components/GerenciarTurma";
import AvaliacaoEstudante from "./components/AvaliacaoEstudante";
import GerenciarAvaliativa from "./components/GerenciarAvaliativas";


function AppRoutes() {
  return (
    // <BrowserRouter>
    <HashRouter>
      <Routes>
        {/* Rota principal com rotas aninhadas */}
        <Route path="/" element={<Home />}>
          <Route path="Board" element={<Board />} />
          <Route path="Tarefas" element={<Tarefas />} />
          <Route path="Contador" element={<Contador />} />
          <Route path="PainelEstudante" element={<PainelEstudante />}>
            <Route path="RegistroEstudante" element={<RegistroEstudante />} />
          </Route>

          <Route path="PainelCurso" element={<PainelCurso />}>
            <Route path="RegistroCurso" element={<RegistroCurso />} />
            <Route path="EditarCurso" element={<EditarCurso />} />
          </Route>

          <Route path="PainelUc" element={<PainelUc />}>
            <Route path="RegistroUc" element={<RegistroUc />} />
            <Route path="InserirEstudanteCurso" element={<InserirEstudanteCurso />} />
          </Route>

          <Route path="PainelIndicadores" element={<PainelIndicadores />}>
            <Route path="ListarIndicadores" element={<ListarIndicadores />} />
          </Route>

          <Route path="PainelAvaliativa" element={<PainelAvaliativa />}>
            <Route path="ListarAvaliativa" element={<ListarAvaliativa />} />
          </Route>

          <Route path="PainelTurma" element={<PainelTurma />}>
            <Route path="ListarTurma" element={<ListarTurmas />} />

            {/* GerenciarTurma e GerenciarAvaliativa no mesmo nível */}
            <Route path="GerenciarTurma" element={<GerenciarTurma />} />
            <Route path="GerenciarAvaliativa" element={<GerenciarAvaliativa />} />

            <Route path="AvaliacaoEstudante" element={<AvaliacaoEstudante />} />
          </Route>

          <Route path="PainelDashBoard" element={<PainelDashBoard />} >
            <Route path="NavPainel" element={<NavPainel />} />
          </Route>
        </Route>

        <Route path="/Login" element={<Login />} />

        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
      </HashRouter>
    /* </BrowserRouter> */
  );
}

export default AppRoutes;