import React, { useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");

  const navigate = useNavigate();

  function handleNameChange(e) {
    
    setName(e.target.value.toLowerCase());
  }
  function handleEmailChange(e) {
    setEmail(e.target.value.toLowerCase());
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    }).then((r) => {
      if (r.ok) {
        navigate("/main");
        r.json().then((user) => onLogin(user));
      } else {
        r.json().then((err) => setErrors(err.errors));
      }
    });
  }
  return (
    <div className="Login">
      
        
      
        <form onSubmit={handleSubmit} className="login-box">
        <h1>Login</h1>
        {errors && <p>{errors}</p>}
          <input type="text" onChange={handleNameChange} placeholder="Name" />
          <input type="email" onChange={handleEmailChange}  placeholder="Email"/>
          <input type="password" onChange={handlePasswordChange} placeholder="Password"/>
          <button>Login</button>
        </form>
     
    </div>
  );
};

export default Login;
