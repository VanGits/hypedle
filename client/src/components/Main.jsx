import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "../styles/Main.css";
import { FaRegComment } from "react-icons/fa";
import { toast } from "react-toastify";
import { AiFillHeart } from "react-icons/ai";
import { AiOutlineHeart } from "react-icons/ai";

const Main = ({ highlights, loading, currentUser }) => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    if (loading) {
      const timeout = setTimeout(() => {
        setShowSkeleton(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [loading]);

  useEffect(() => {
    // Update likes state
    const likesMap = {};
    currentUser.likes.forEach((like) => {
      likesMap[like.highlight_id] = like.id;
    });
    setLikes(likesMap);
  }, [currentUser.likes]);

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

  const handleLike = (e, highlightId) => {
    e.preventDefault();

    const likedHighlight = likes[highlightId];

    if (likedHighlight) {
      // Delete the like
      fetch(`/highlights/${highlightId}/likes/${likedHighlight}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          highlight_id: highlightId,
        }),
      })
        .then((r) => {
          if (r.ok) {
            if (r.status === 204) {
              // Like deleted successfully (no response body)
              toast.success("Unliked");
              // Remove the like from the state
              const updatedLikes = { ...likes };
              delete updatedLikes[highlightId];
              setLikes(updatedLikes);
            } else {
              r.json().then((likeData) => console.log(likeData));
            }
          } else {
            r.json().then((err) => toast.error(err.errors[0]));
          }
        })
        .catch((err) => {
          console.error("Error deleting like:", err);
        });
    } else {
      // Add the like
      fetch(`/highlights/${highlightId}/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          highlight_id: highlightId,
        }),
      })
        .then((r) => {
          if (r.ok) {
            r.json().then((likeData) => {
              console.log(likeData);
              // Update the state with the new like
              const updatedLikes = { ...likes };
              updatedLikes[highlightId] = likeData.id;
              setLikes(updatedLikes);
            });
          } else {
            r.json().then((err) => toast.error(err.errors[0]));
          }
        })
        .catch((err) => {
          console.error("Error adding like:", err);
        });
    }
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
        highlights.map((highlight) => {
          const isLiked = likes[highlight.id];

          return (
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
              <p className="category">{highlight.game.title}</p>
              <div className="highlight-reactions">
                {isLiked ? (
                  <AiFillHeart
                    className="highlight-reaction heart"
                    onClick={(e) => handleLike(e, highlight.id)}
                  />
                ) : (
                  <AiOutlineHeart
                    className="highlight-reaction heart"
                    onClick={(e) => handleLike(e, highlight.id)}
                  />
                )}
                   <p>{highlight.likes.length + (isLiked ? 1 : 0)} likes</p>
                <FaRegComment className="highlight-reaction" />
                <p>No comments found</p>
              </div>
              <form action="" className="comment-section">
                {currentUser.image_url && (
                  <img src={currentUser.image_url} alt="" />
                )}
                <input type="text" placeholder="Write your comment..." />
              </form>
            </div>
          );
        })}
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
