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
import UserContext from "./context/UserContext";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [userHighlights, setUserHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    fetch("/me")
      .then((res) => {
        if (res.ok) {
          res.json().then((user) => setCurrentUser(user));
        } else {
          toast.error("Please log in");
        }
      })
      .catch((error) => {
        console.error(error); 
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

  const deleteHighlight = (deletedHighlight) => {
    fetch(`/highlights/${deletedHighlight.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Remove the deleted highlight from the highlights state
          if (highlights && highlights.length > 0) {
            
            const updatedHighlights = highlights.filter(
              (highlight) => highlight.id !== deletedHighlight.id
            );
            setHighlights(updatedHighlights);
          }
        
          if (currentUser && userHighlights && userHighlights.length > 0) {
            // Remove the deleted highlight from the userHighlights state
            const updatedUserHighlights = userHighlights.filter(
              (highlight) => highlight.id !== deletedHighlight.id
            );
            setUserHighlights(updatedUserHighlights);
          }
  
          toast.success("Highlight deleted!");
        } else {
          res.json().then((err) => toast.error(err.errors[0]));
        }
      })
      .catch((error) => {
        // Handle the error
        console.log(error);
      });
  };

  const youtubePlayerOptions = {
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
      showinfo: 1,
      rel: 1,
      loop: 0,
      fs: 0,
      playsinline: 0,
    },
  };
  
  return (
    <div className="App">
      <ToastContainer />
      <BrowserRouter>
      <UserContext.Provider value={currentUser}>
        <Routes>
          <Route path="/" element={<Login onLogin={setCurrentUser} />} />
          <Route path="/signup" element={<Signup onLogin={setCurrentUser} />} />

          {currentUser && (
            <>
            <Route
              path="/home"
              element={
                <>
                  <Nav  setSidebarOpen={setSidebarOpen} sidebarOpen = {sidebarOpen}/>
                  <Sidebar  setCurrentUser = {setCurrentUser} sidebarOpen={sidebarOpen}/>
                  <Main highlights = {highlights} setHighlights = {setHighlights}
                  loading={loading}  youtubePlayerOptions={youtubePlayerOptions}/>
                  
                </>
              }
            />
            <Route
              path="/my-highlights"
              element={
                <>
                  <Nav   sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                  <Sidebar  sidebarOpen={sidebarOpen}  setCurrentUser = {setCurrentUser}/>
                  <ShowHighlights userHighlights = {userHighlights} games = {games} updateHighlight={updateHighlight} deleteHighlight={deleteHighlight} youtubePlayerOptions={youtubePlayerOptions}/>
                </>
              }
            />
              <Route
              path="/create-highlight"
              element={
                <>
                  <Nav  sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}  />               
                  <Sidebar  sidebarOpen={sidebarOpen}  setCurrentUser = {setCurrentUser}/>
                  <CreateHighlight addHighlight = {addHighlight} games = {games}/>
                </>
              }
            />
              <Route
              path="/game-categories"
              element={
                <>
                  <Nav  sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                  
                 
                  <Sidebar sidebarOpen={sidebarOpen}  setCurrentUser = {setCurrentUser}/>
                </>
              }
            />
            </>
            
          )}
        </Routes>
      
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
