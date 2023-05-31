import React, { useContext, useEffect, useState } from "react";
import "../styles/CreateHighlight.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

const CreateHighlight = ({ addHighlight, games }) => {
  
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [videoURL, setVideoURL] = useState("")
  const [description, setDescription] = useState("")
  const currentUser = useContext(UserContext);
   const navigate = useNavigate()
  

  function handleCategory(e){
    setCategory(e.target.value)
  }
  function handleTitle(e){
    setTitle(e.target.value)
  }
  function handleVideoURL(e){
    setVideoURL(e.target.value)
  }
  function handleDescription(e){
    setDescription(e.target.value)
  }
  
  function handleSubmit(e){
    e.preventDefault()
    fetch("/highlights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            user_id: currentUser.id,
            title: title,
            description: description,
            video_url: videoURL,
            game_id: parseInt(category)

        }),
      }).then((r) => {
        if (r.ok) {
          
          r.json().then((newHighlight) => addHighlight(newHighlight));
          setTitle("")
          setVideoURL("")
          setDescription("")
          toast.success("Highlight created!")
          navigate("/home")
        } else {
          r.json().then((err) => toast.error(err.errors[0]));
        }
      });
  }
  
  return (
    <div className="CreateHighlight">
     
        
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" onChange={handleTitle}/>
        <input type="text" placeholder="Video URL" onChange={handleVideoURL}/>
        <select onChange={handleCategory}>
        <option value="">Pick a category</option>
          {Array.isArray(games) &&
            games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.title}
              </option>
            ))}
        </select>
        <textarea type="text" placeholder="Description" onChange={handleDescription}/>

        <button>Submit</button>
      </form>
    </div>
  );
};

export default CreateHighlight;
