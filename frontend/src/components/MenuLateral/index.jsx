import { Nav, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { GiTeacher } from "react-icons/gi";
import { GrDashboard, GrGroup } from "react-icons/gr";
import { PiStudentBold } from "react-icons/pi";
import styles from './MenuLateral.module.css';
import { useState } from 'react';

function MenuLateral() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${styles.MenuLateral} ${isCollapsed ? styles.collapsed : ''}`}>
      <button className={styles.toggleButton} onClick={toggleMenu}>
        <FaBars />
      </button>

      <Nav className="flex-column">

        {/* CURSOS */}
        <NavLink 
          to="/Home/PainelCurso"
          className={({ isActive }) => (isActive ? styles.active : '')}
        >
          <GiTeacher className={styles.icon} />
          {!isCollapsed && <span className={styles.label}>Curso</span>}
        </NavLink>

        {/* ESTUDANTE */}
        <NavItem>
          <NavLink 
            to="/Home/PainelEstudante"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <PiStudentBold className={styles.icon} />
            {!isCollapsed && 'Estudante'}
          </NavLink>
        </NavItem>

        {/* TURMA */}
        <NavItem>
          <NavLink 
            to="/Home/PainelTurma"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <GrGroup className={styles.icon} />
            {!isCollapsed && 'Turma'}
          </NavLink>
        </NavItem>

        {/* DASHBOARD */}
        <NavItem>
          <NavLink 
            to="/Home/PainelDashBoard"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            <GrDashboard className={styles.icon} />
            {!isCollapsed && 'Dashboard'}
          </NavLink>
        </NavItem>

      </Nav>
    </div>
  );
}

export default MenuLateral;
