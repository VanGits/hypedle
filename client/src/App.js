import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
 
  useEffect(() => {
    fetch("/me").then((res) => {
      if (res.ok) {
        res.json().then((user) => setCurrentUser(user));
      } else {
        toast.error("Please log in");
      }
    });
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {currentUser && (
            <Route
              path="/"
              element={
                <Nav user={currentUser} setCurrentUser={setCurrentUser}  />
              }
            />
          )}
          <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
