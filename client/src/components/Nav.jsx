import React from "react";
import "../styles/Nav.css";
import { BiLogOut } from "react-icons/bi";
const Nav = () => {
  return (
    <nav className="Nav">
      <div className="nav-content-wrapper">
        <div className="nav-content">
          <h1>Hypedle</h1>
        </div>
        <div className="nav-content-2">
          <div className="logout-wrapper">
            <BiLogOut className="logout-btn"/>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
