import React, { useContext } from "react";
import "../styles/Nav.css";
import { IoIosNotifications } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";


const Nav = ({setSidebarOpen, sidebarOpen}) => {

 
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
 
  return (
    <nav className="Nav">
      <GiHamburgerMenu className="burger" onClick={(toggleSidebar)}/>
      <div className="nav-content-wrapper">
        <div className="nav-content">
        
          <h1>Hypedle</h1>
          
        </div>
        <IoIosNotifications id="noti"/>
      </div>
    </nav>
  );
};

export default Nav;
