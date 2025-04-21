import { BrowserRouter, Routes, Route } from "react-router-dom";
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
// import PageNotFound from "./pages/PageNotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal com rotas aninhadas */}
        <Route path="/" element={<Home />}>
          <Route path="Board" element={<Board />} />
          <Route path="Tarefas" element={<Tarefas />} />
          <Route path="Contador" element={<Contador />} />
          <Route path="PainelEstudante" element={<PainelEstudante />}>
            {/* Rota aninhada dentro de PainelEstudante */}
            <Route path="RegistroEstudante" element={<RegistroEstudante />} />
          </Route>
          
          <Route path="PainelCurso" element={<PainelCurso />}>
            {/* Rota aninhada dentro de PainelCurso */}
            <Route path="RegistroCurso" element={<RegistroCurso />} />  
            <Route path="EditarCurso" element={<EditarCurso />} />
          </Route>

          <Route path="PainelUc" element={<PainelUc />}>
            {/* Rota aninhada dentro de PainelCurso */}
            <Route path="RegistroUc" element={<RegistroUc />} />  
          </Route>
          <Route path="PainelIndicadores" element={<PainelIndicadores />}>
            {/* Rota aninhada dentro de PainelCurso */}
            {/* <Route path="RegistroUc" element={<RegistroUc />} />   */}
          </Route>
          
        </Route>

        {/* Página Não Encontrada */}
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;