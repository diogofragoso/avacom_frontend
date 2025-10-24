// config.jsx - Corrigido, mas ainda não recomendado
function IP() {
    // const ip = "137.131.204.142";
    const ip = "localhost";
    return {
        address: ip // Retornando o IP em uma propriedade
    };
}

export default IP;

// Em outro arquivo, para usar:
// import IP from './config';
// const apiUrl = IP().address; // Note que precisa chamar a função IP()