import React, { useEffect, useState } from "react";
import "../styles/CreateHighlight.css";
const CreateHighlight = () => {
  const [games, setGames] = useState([]);
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [videoURL, setVideoURL] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState("")
  
  useEffect(() => {
    fetch("/games")
      .then((res) => res.json())
      .then((gamesData) => setGames(gamesData));
  }, []);

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
            title: title,
            description: description,
            video_url: videoURL,
            game_id: parseInt(category)

        }),
      }).then((r) => {
        if (r.ok) {
          
          r.json().then((data) => console.log(data));
          alert("Submitted!")
        } else {
          r.json().then((err) => console.log(err.errors));
        }
      });
  }
  
  return (
    <div className="CreateHighlight">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" onChange={handleTitle}/>
        <input type="text" placeholder="Video URL" onChange={handleVideoURL}/>
        <select onChange={handleCategory}>
          {games &&
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
