import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./components/Signup";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";
import CreateHighlight from "./components/CreateHighlight";
import ShowHighlights from "./components/ShowHighlights";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [userHighlights, setUserHighlights] = useState([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/me").then((res) => {
      if (res.ok) {
        res.json().then((user) => setCurrentUser(user));
      } else {
        toast.error("Please log in");
      }
    });
  }, []);
  

  useEffect(() => {
    fetch('/highlights')
      .then((res) => res.json())
      .then((highlightData) => setHighlights(highlightData));
     
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetch('/my-highlights')
        .then((res) => res.json())
        .then((userHighlightData) => setUserHighlights(userHighlightData));
    } else {
      setUserHighlights([]);
    }
  }, [currentUser]);

  
 
 
  console.log(currentUser)
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login onLogin={setCurrentUser} />} />
          <Route path="/signup" element={<Signup onLogin={setCurrentUser} />} />

          {currentUser && (
            <>
            <Route
              path="/home"
              element={
                <>
                  <Nav user={currentUser} setCurrentUser={setCurrentUser}  />
                  <Sidebar currentUser = {currentUser} setCurrentUser = {setCurrentUser}/>
                  <Main highlights = {highlights} loading={loading} setLoading={setLoading}/>
                  
                </>
              }
            />
            <Route
              path="/my-highlights"
              element={
                <>
                  <Nav user={currentUser}   />
                  <Sidebar currentUser = {currentUser} setCurrentUser = {setCurrentUser}/>
                  <ShowHighlights userHighlights = {userHighlights}/>
                </>
              }
            />
              <Route
              path="/create-highlight"
              element={
                <>
                  <Nav user={currentUser}   />               
                  <Sidebar currentUser = {currentUser} setCurrentUser = {setCurrentUser}/>
                  <CreateHighlight/>
                </>
              }
            />
              <Route
              path="/game-categories"
              element={
                <>
                  <Nav user={currentUser}   />
                  
                 
                  <Sidebar currentUser = {currentUser} setCurrentUser = {setCurrentUser}/>
                </>
              }
            />
            </>
            
          )}
        </Routes>
      

      </BrowserRouter>
    </div>
  );
}

export default App;
