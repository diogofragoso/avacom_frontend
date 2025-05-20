import React from 'react';
import styles from './TituloAvaliativa.module.css';

const TituloAvaliativa = ({ nome_uc, indicador, nome_indicador, avaliativas }) => {
  return (
    <div className={styles.card}>
      <div className={styles.title}>Atividades Avaliativas</div>
      <div className={styles.item}>
        UC: <span className={styles.highlight}>{nome_uc}</span>
      </div>
      <div className={styles.item}>
        Indicador {indicador}: <span className={styles.highlight}>{nome_indicador}</span>
      </div>
      <div className={styles.item}>
        Total: <span className={styles.highlight}>{avaliativas.length}</span>
      </div>
    </div>
  );
};

export default TituloAvaliativa;
