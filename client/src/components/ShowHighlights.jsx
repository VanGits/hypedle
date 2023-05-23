import React from "react";
import "../styles/ShowHighlights.css";
import ReactPlayer from "react-player";
import sad from "../assets/sad.svg";
import { MdModeEdit } from "react-icons/md";

const ShowHighlights = ({ userHighlights }) => {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Get day, month, and time components
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format the date string
    const formattedDate = `${day} ${month} at ${time}`;
    return formattedDate;
  };

  return (
    <div className="ShowHighlights">
      {userHighlights.length > 0 ? (
        <div className="grid-wrapper">

          {userHighlights.map((highlight) => (
            <div className="user-highlight-wrapper">
              <MdModeEdit className="edit-btn"/>
              <h1>{highlight.title}</h1>
              <p id="date">{formatDate(highlight.created_at)}</p>
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
              <p>{highlight.game.title}</p>
              <p>{highlight.description}</p>
             
            </div>
          ))}
        </div>
      ) : (
        <div className="no-highlights">
          <img src={sad} alt="No Highlights" />
          <h3>No Highlights yet!</h3>
        </div>
      )}
    </div>
  );
};

export default ShowHighlights;
