import React from 'react';
import { Card } from 'react-bootstrap';
import ReactLogo from '../../assets/react.svg'; // ajuste conforme o caminho real da imagem
import styles from  './CursoCard.module.css'; // ajuste conforme o caminho real do CSS

const CursoCard = ({ titulo, descricao }) => {
  return (
    <div className={styles.cursocard}>
     {/* <Card style={{ width: '100%' }}>   */}
     <Card>  
      <Card.Img variant="top" src={ReactLogo} alt="Logo do curso" />
      <Card.Body>
        <Card.Title className={styles.title}>{titulo}</Card.Title>
        <Card.Text>{descricao}</Card.Text>
      </Card.Body>
    </Card>
    </div>
  );
};

export default CursoCard;
