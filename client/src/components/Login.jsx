import React, { useState } from "react";
import "../styles/Login.css";
const Login = ({onLogin}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleNameChange(e) {
    setName(e.target.value);
  }
  function handleEmailChange(e) {
    setEmail(e.target.value);
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
        if (r.ok){
            r.json().then((name) => console.log(name))
        } else {
            r.json().then((err) => console.log(err.errors))
        }
    });
  }
  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleNameChange} />
        <input type="email" onChange={handleEmailChange} />
        <input type="password" onChange={handlePasswordChange} />
        <button >Login</button>
      </form>
    </div>
  );
};

export default Login;
