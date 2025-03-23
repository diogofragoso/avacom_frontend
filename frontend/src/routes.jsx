import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Board from "./pages/Board";
import Tarefas from "./pages/Tarefas";
import Contador from "./pages/Contador";
import RegistroEstudante from "./pages/RegistroEstudante";
import PainelEstudante from "./pages/PainelEstudante";
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
          <Route path="PainelEstudante" element={<PainelEstudante />} />
          <Route path="RegistroEstudante" element={<RegistroEstudante />} />
        </Route>

        {/* Página Não Encontrada */}
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;