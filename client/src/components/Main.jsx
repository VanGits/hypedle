import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "../styles/Main.css";
import { HiOutlineHeart } from "react-icons/hi";
import { FaRegComment } from "react-icons/fa";

const Main = ({ highlights, loading, currentUser }) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);

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

  const renderSkeleton = () => (
    <div className="highlight">
      <div className="highlight-post">
        <div className=" skeleton-load skeleton-profile-pic"></div>
        <div className=" highlight-post-details">
          <div className="skeleton-name"></div>
          <div className="skeleton-date"></div>
        </div>
      </div>
      <div className=" skeleton-load skeleton-video"></div>
      <div className=" skeleton-load skeleton-category"></div>
      <div className=" skeleton-load skeleton-description"></div>
    </div>
  );

  const renderHighlights = () => (
    <>
      {Array.isArray(highlights) &&
        highlights.map((highlight) => (
          <div className="highlight" key={highlight.id}>
            <div className="highlight-post">
              {highlight.user.image_url && (
                <img src={highlight.user.image_url} alt="" />
              )}
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
            <div className="highlight-reactions">
              <HiOutlineHeart className="highlight-reaction" />
              <p>0 likes</p>
              <FaRegComment className="highlight-reaction" />
              <p>No comments found</p>
            </div>

            <p className="category">{highlight.game.title}</p>
            {/* <p>Description: {highlight.description}</p> */}
            <form action="" className="comment-section">
                <img src={currentUser.image_url} alt="" />
              <input type="text" placeholder="Write your comment..."/>
            </form>
          </div>
        ))}
    </>
  );

  return (
    <div className="Main">
      {loading ? (
        <>
          {renderSkeleton()}
          {renderSkeleton()}
          {renderSkeleton()}
        </>
      ) : (
        renderHighlights()
      )}
    </div>
  );
};

export default Main;
