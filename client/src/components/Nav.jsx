import React, { useContext } from "react";
import "../styles/Nav.css";
import { IoIosNotifications } from "react-icons/io";



const Nav = () => {

 

 
  return (
    <nav className="Nav">
      <div className="nav-content-wrapper">
        <div className="nav-content">
        
          <h1>HiLites</h1>
          
        </div>
        <IoIosNotifications id="noti"/>
      </div>
    </nav>
  );
};

export default Nav;
