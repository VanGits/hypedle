import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "../styles/Main.css";

const Main = ({ highlights, loading }) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (!loading) {
      // Delay showing the skeleton for a short period
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

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

  // Custom YouTube player options
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
    <div className="Main">
      {highlights &&
        highlights.map((highlight) => (
          <div className="highlight" key={highlight.id}>
            {showSkeleton ? (
              <div className="skeleton">
                <div className="skeleton-load"></div>
              </div>
            ) : (
              <>
                <div className="highlight-post">
                  {highlight.user.image_url &&<img src={highlight.user.image_url} alt="" />}
                  <div className="highlight-post-details">
                    <p id="userName">{highlight.user.name.toUpperCase()}</p>
                    <p id="date">{formatDate(highlight.created_at)}</p>
                  </div>
                </div>
                <p>{highlight.title}</p>
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
                <p>Description: {highlight.description}</p>
                <p>Category: {highlight.game.title}</p>
              </>
            )}
          </div>
        ))}
    </div>
  );
};

export default Main;
