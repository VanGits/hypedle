import React, { useContext } from "react";
import "../styles/Nav.css";
import { GiHamburgerMenu } from "react-icons/gi";


const Nav = ({setSidebarOpen, sidebarOpen}) => {

 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
 
  return (
    <nav className="Nav">
      
      <div className="nav-content-wrapper">
      <GiHamburgerMenu className="burger" onClick={toggleSidebar}/>
        <div className="nav-content">
        
          <h1>Hypedle</h1>
          
        </div>
       
      </div>
    </nav>
  );
};

export default Nav;
