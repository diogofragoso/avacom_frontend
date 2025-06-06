import { Nav, NavItem } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaHome, FaClipboardList, FaUser, FaCog, FaBars } from 'react-icons/fa';
import { GiTeacher } from "react-icons/gi";
import { FcBullish } from 'react-icons/fc';
import { TbTargetArrow } from "react-icons/tb";
import { GrDashboard,GrGroup } from "react-icons/gr";
import { PiStudentBold } from "react-icons/pi";
import NavPainel from '../../components/NavPainel'
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
        {/* <NavItem>
          <NavLink to="/Board" className={({ isActive }) => (isActive ? styles.active : '')}>
            <FaHome className={styles.icon} />
            {!isCollapsed && 'Conteúdo'}
          </NavLink>
        </NavItem> */}
        <NavLink to="/PainelCurso" className={({ isActive }) => (isActive ? styles.active : '')}>
          <GiTeacher className={styles.icon} />
          {!isCollapsed && <span className={styles.label}>Curso</span>}
        </NavLink>


        {/* <NavItem>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : '')}>
            <FaUser className={styles.icon} />
            {!isCollapsed && 'Perfil'}
          </NavLink>
        </NavItem> */}
        {/* <NavItem>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? styles.active : '')}>
            <FaCog className={styles.icon} />
            {!isCollapsed && 'Configurações'}
          </NavLink>
        </NavItem> */}
        <NavItem>
          <NavLink to="/PainelEstudante" className={({ isActive }) => (isActive ? styles.active : '')}>
            <PiStudentBold className={styles.icon} />
            {!isCollapsed && 'Estudante'}
          </NavLink>

          <NavItem>
             <NavLink to="/PainelTurma" className={({ isActive }) => (isActive ? styles.active : '')}>
            <GrGroup className={styles.icon} />
            {!isCollapsed && 'Turma'}
          </NavLink>

          </NavItem>
          
        </NavItem>
        <NavItem>
          <NavLink to="/PainelDashBoard" className={({ isActive }) => (isActive ? styles.active : '')}>
            <GrDashboard className={styles.icon} />
            {!isCollapsed && 'Dashboard'}
          </NavLink>
        </NavItem>


      </Nav>
    </div>
  );
}

export default MenuLateral;