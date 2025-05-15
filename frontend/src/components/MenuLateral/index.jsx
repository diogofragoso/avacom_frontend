import { Nav, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaHome, FaClipboardList, FaUser, FaCog, FaBars } from 'react-icons/fa';
import { GiTeacher } from "react-icons/gi";
import { FcBullish } from 'react-icons/fc';
import { TbTargetArrow } from "react-icons/tb";
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
        <NavItem>
          <NavLink to="/Board" className={({ isActive }) => (isActive ? styles.active : '')}>
            <FaHome className={styles.icon} />
            {!isCollapsed && 'Conteúdo'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/Tarefas" className={({ isActive }) => (isActive ? styles.active : '')}>
            <FaClipboardList className={styles.icon} />
            {!isCollapsed && 'Tarefas'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : '')}>
            <FaUser className={styles.icon} />
            {!isCollapsed && 'Perfil'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? styles.active : '')}>
            <FaCog className={styles.icon} />
            {!isCollapsed && 'Configurações'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/PainelEstudante" className={({ isActive }) => (isActive ? styles.active : '')}>
            <PiStudentBold className={styles.icon} />
            {!isCollapsed && 'Estudante'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/PainelCurso" className={({ isActive }) => (isActive ? styles.active : '')}>
            <GiTeacher className={styles.icon} />
            {!isCollapsed && 'Curso'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/PainelUc"lassName={({ isActive }) => (isActive ? styles.active : '')}>
            <TbTargetArrow className={styles.icon} />
            {!isCollapsed && 'UC'}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/Contador" className={({ isActive }) => (isActive ? styles.active : '')}>
            <FcBullish className={styles.icon} />
            {!isCollapsed && 'Contador'}
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  );
}

export default MenuLateral;