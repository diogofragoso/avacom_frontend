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
import ListarIndicadores from "./components/ListarIndicadores";
import ListarAvaliativa from "./components/ListarAvaliativa";
import PainelAvaliativa from "./pages/PainelAvaliativa";
import Login from "./components/Login";


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
           <Route path="ListarIndicadores" element={<ListarIndicadores />} />  
          </Route>

          <Route path="PainelAvaliativa" element={<PainelAvaliativa />}>          
           <Route path="ListarAvaliativa" element={<ListarAvaliativa />} />  
          </Route>

          <Route path="/Login" element={<Login />} />


          
          
        </Route>

        {/* Página Não Encontrada */}
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;