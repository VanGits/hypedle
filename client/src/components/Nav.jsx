import React from "react";
import "../styles/Nav.css";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Nav = ({user, setCurrentUser}) => {

  const navigate = useNavigate()
  function handleLogOut(e){
   e.preventDefault()
   fetch("/logout", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  
  }).then((r) => {
      if (r.ok){
          setCurrentUser(null)
          navigate("/login")
          
      } 
  });
  }
  return (
    <nav className="Nav">
      <div className="nav-content-wrapper">
        <div className="nav-content">
          <h1>Hypedle</h1>
        </div>
        <div className="nav-content-2">
          {user && <p>Welcome, {user.name}</p>}
          <div className="logout-wrapper"onClick={handleLogOut}>

            <BiLogOut className="logout-btn" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
