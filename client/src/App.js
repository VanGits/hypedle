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
  const [games, setGames] = useState([]);
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
    fetch("/games")
      .then((res) => res.json())
      .then((gamesData) => setGames(gamesData));
  }, []);
 
  

  useEffect(() => {
    fetch('/highlights')
      .then((res) => res.json())
      .then((highlightData) => {
        setHighlights(highlightData);
        setLoading(false);
      });
  
    if (currentUser) {
      fetch('/my-highlights')
        .then((res) => res.json())
        .then((userHighlightData) => setUserHighlights(userHighlightData));
    } else {
      setUserHighlights([]);
    }
  }, [currentUser]);

  const addHighlight = (newHighlight) => {
    
    setHighlights([newHighlight, ...highlights]);
    
    if (currentUser && newHighlight.user.id === currentUser.id) {
      setUserHighlights([ newHighlight, ...userHighlights]);
    }
    
  }

  const updateHighlight = (editedHighlight) => {
    const updatedHighlights = highlights.map((highlight) => {
      if (highlight.id === editedHighlight.id) {
        return { ...highlight, ...editedHighlight };
      } else {
        return highlight;
      }
    });
    setHighlights(updatedHighlights);
  
    if (currentUser && editedHighlight.user.id === currentUser.id) {
      const updatedUserHighlights = userHighlights.map((highlight) => {
        if (highlight.id === editedHighlight.id) {
          return { ...highlight, ...editedHighlight };
        } else {
          return highlight;
        }
      });
      setUserHighlights(updatedUserHighlights);
    }
  }
  
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
                  <Main highlights = {highlights} loading={loading} currentUser={currentUser} />
                  
                </>
              }
            />
            <Route
              path="/my-highlights"
              element={
                <>
                  <Nav user={currentUser}   />
                  <Sidebar currentUser = {currentUser} setCurrentUser = {setCurrentUser}/>
                  <ShowHighlights userHighlights = {userHighlights} games = {games} updateHighlight={updateHighlight}/>
                </>
              }
            />
              <Route
              path="/create-highlight"
              element={
                <>
                  <Nav user={currentUser}   />               
                  <Sidebar currentUser = {currentUser} setCurrentUser = {setCurrentUser}/>
                  <CreateHighlight addHighlight = {addHighlight} games = {games}/>
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
