import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import { useEffect, useState } from "react";
import Login from "./components/Login";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("/me").then((res) => {
      if (res.ok) {
        res.json().then((user) => setCurrentUser(user));
      }
    });
  }, []);
  if (!currentUser) return <Login onLogin={setCurrentUser}/>
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Nav/>}/>
          <Route path="/login" element={<Login/>}/>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
