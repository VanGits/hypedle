import React, { useState } from "react";
import "../styles/Signup.css";
import { Link, useNavigate } from "react-router-dom";
const Signup = ({onLogin}) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate()

  function handleNameChange(e){
    setName(e.target.value.toLowerCase())
  }
  function handleEmailChange(e){
    setEmail(e.target.value.toLowerCase())
  }
  function handlePasswordChange(e){
    setPassword(e.target.value.toLowerCase())
  }

  function handleSubmit(e){
    e.preventDefault();
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    }).then((r) => {
      if (r.ok) {
        navigate("/home");
        r.json().then((user) => onLogin(user));
      } else {
        r.json().then((err) => setErrors(err.errors));
      }
    });
  }
 

  return (
    <div className="Signup Login">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>Register</h1>
        {errors && <p>{errors}</p>}
        <input type="text" placeholder="Name" onChange={handleNameChange}/>
        <input type="email" placeholder="Email" onChange={handleEmailChange}/>
        <input type="password" placeholder="Password" onChange={handlePasswordChange}/>
        <button>Signup</button>
        <span>
          Already have an account?{" "}
          <Link to="/">
            <a>Login</a>
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
