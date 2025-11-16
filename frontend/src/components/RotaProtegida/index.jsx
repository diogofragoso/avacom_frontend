import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import usuarioService from '../../services/usuarioService'; 
const RotaProtegida = () => {
    const isAuth = usuarioService.isAuthenticated();
    
    // Se estiver autenticado, renderiza as rotas filhas (Outlet).
    // Se não, redireciona para a página de Login (assumindo que seja a raiz "/").
    return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default RotaProtegida;