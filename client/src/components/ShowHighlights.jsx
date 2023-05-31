import React, { useEffect, useRef, useState } from "react";
import "../styles/ShowHighlights.css";
import ReactPlayer from "react-player";
import sad from "../assets/sad.svg";
import { MdModeEdit } from "react-icons/md";
import {toast } from "react-toastify";
import { Link } from "react-router-dom";

const ShowHighlights = ({ userHighlights, games, updateHighlight, deleteHighlight, youtubePlayerOptions }) => {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    let formattedDate = `${day} ${month} at ${time}`;

    return formattedDate;
  };

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editedHighlights, setEditedHighlights] = useState({});
  const editDeleteBoxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        editDeleteBoxRef.current &&
        !editDeleteBoxRef.current.contains(event.target)
      ) {
        if (
          event.target.closest(".edit-btn") ||
          event.target.closest(".edit-btns") ||
          event.target.tagName === "INPUT" ||
          event.target.tagName === "SELECT"
        ) {
          return;
        }

        setIsEdit(false);
        setEditId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const handleEdit = (id) => {
    setEditId(id);
  };

  const handleEditInputs = () => {
    setIsEdit(!isEdit);
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setEditedHighlights((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [name]: value,
      },
    }));
  };

  const handleSave = (e, highlightId) => {
    e.preventDefault();
    
    const editedHighlight = editedHighlights[highlightId];

    setIsEdit(false);

    if (!editedHighlight) return;

    fetch(`/highlights/${highlightId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedHighlight),
    }).then((r) => {
      if (r.ok) {
        r.json().then((editedHighlight) => updateHighlight(editedHighlight));
        toast.success("Highlight updated!");
      } else {
        r.json().then((err) => toast.error(err.errors[0]));
      }
    });
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    setIsEdit(false);
  
    deleteHighlight({ id });
  };

  return (
    <div className="ShowHighlights">
      {userHighlights.length > 0 ? (
        <div className="grid-wrapper">
          {userHighlights.map((highlight) => (
            
            <div
              className="user-highlight-wrapper"
              key={highlight.id}
              ref={editDeleteBoxRef}
            >
              
              <MdModeEdit
                className="edit-btn"
                onClick={() => handleEdit(highlight.id)}
              />
              {highlight.id === editId && (
                <div className="edit-btns">
                  {isEdit ? (
                    <button onClick={(e) => handleSave(e, highlight.id)}>
                      Save
                    </button>
                  ) : (
                    <button onClick={handleEditInputs}>Edit</button>
                  )}
                  <button onClick={(e) => handleDelete(e, highlight.id)}>Delete</button>
                </div>
              )}
              {editId === highlight.id && isEdit ? (
                <input
                  type="text"
                  name="title"
                  value={
                    editedHighlights[highlight.id]?.title !== undefined
                      ? editedHighlights[highlight.id].title
                      : highlight.title
                  }
                  onChange={(e) => handleInputChange(e, highlight.id)}
                />
              ) : (
                <h1>{highlight.title}</h1>
              )}
              <p id="date"> {formatDate(highlight.created_at)}</p>
              <div className="video-player">
                <ReactPlayer
                  url={highlight.video_url}
                  controls
                  width="100%"
                  height="100%"
                  className="react-player"
                  config={{
                    youtube: youtubePlayerOptions,
                  }}
                />
              </div>
              {editId === highlight.id && isEdit ? (
                <select
                  name="game_id"
                  value={
                    editedHighlights[highlight.id]?.game_id || highlight.game.id
                  }
                  onChange={(e) => handleInputChange(e, highlight.id)}
                >
                  {Array.isArray(games) &&
                    games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.title}
                      </option>
                    ))}
                </select>
              ) : (
                <p>{highlight.game.title}</p>
              )}
              {editId === highlight.id && isEdit ? (
                <input
                  type="text"
                  name="description"
                  value={
                    editedHighlights[highlight.id]?.description !== undefined
                      ? editedHighlights[highlight.id].description
                      : highlight.description
                  }
                  onChange={(e) => handleInputChange(e, highlight.id)}
                />
              ) : (
                <p>{highlight.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-highlights">
          <img src={sad} alt="No Highlights" />
          <h3>No Highlights yet!</h3>
          <Link to="/create-highlight" >Click here to create one!</Link>
        </div>
      )}
    </div>
  );
};

export default ShowHighlights;
