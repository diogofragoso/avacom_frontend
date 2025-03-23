import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Contador() {
    const [contador, setContador] = useState(0);

    function Incrementar() {
        setContador(contador + 1);
    }  

    function Decrementar(){
        setContador(contador - 1);
    }
    
    
    return (
        <div>
            <h1>{contador}</h1>
            <button onClick={Incrementar}>Aumentar</button>
            <button onClick={Decrementar}>Diminuir</button>
        </div>
    );
}

            export default Contador;
