import React from "react";
import "../styles/ShowHighlights.css";
import ReactPlayer from "react-player";
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
        <div className="grid-wrapper">
      {userHighlights &&
        userHighlights.map((highlight) => {
          return (
            <div className="user-highlight-wrapper">
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
            </div>
          );
        })}
        </div>
    </div>
  );
};

export default ShowHighlights;
