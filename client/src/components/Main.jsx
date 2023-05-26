import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "../styles/Main.css";
import { FaRegComment } from "react-icons/fa";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Modal from "./Modal";
import UserContext from "../context/UserContext";
import nothing from "../assets/nothing.svg"

const Main = ({ highlights, loading, youtubePlayerOptions }) => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [likes, setLikes] = useState({});
  const currentUser = useContext(UserContext);

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
  }, [currentUser]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    return formattedDate;
  };

  const handleLike = (e, highlightId) => {
    e.preventDefault();

    const likedHighlight = likes[highlightId];
    const method = likedHighlight ? "DELETE" : "POST";

    fetch(
      `/highlights/${highlightId}/likes${
        likedHighlight ? `/${likedHighlight}` : ""
      }`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          highlight_id: highlightId,
        }),
      }
    )
      .then((response) => {
        if (response.ok) {
          const updatedLikes = { ...likes };

          if (likedHighlight) {
            delete updatedLikes[highlightId];
          } else {
            return response.json().then((likeData) => {
              updatedLikes[highlightId] = likeData.id;
              return updatedLikes;
            });
          }

          setLikes(updatedLikes);
        } else {
          return response.json().then((errorData) => {
            toast.error(errorData.errors[0]);
          });
        }
      })
      .then((updatedLikes) => {
        if (updatedLikes) {
          setLikes(updatedLikes);
        }
      })
      .catch((error) => {
        console.error("Error handling like:", error);
      });
  };
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  
  const openModal = (highlight) => {
   
    setSelectedHighlight(highlight);
  };

  const closeModal = () => {
    setSelectedHighlight(null);
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

  const [commentLength, setCommentLength] = useState(0)

  function onPassLength(length){
    
    setCommentLength(length)
  }

  
  
  
  const renderHighlights = () => (
    <>
      {Array.isArray(highlights) &&
        highlights.map((highlight) => {
          const isLiked = likes[highlight.id];
          const likes_list = highlight.likes;
          const found = likes_list.some(
            (like) => like.user_id === currentUser.id
          );
          const updatedLikeCount = found
            ? isLiked
              ? likes_list.length
              : likes_list.length - 1
            : isLiked
            ? likes_list.length + 1
            : likes_list.length;


           
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
                <p>{updatedLikeCount} likes</p>
                <FaRegComment
                  className="highlight-reaction"
                  onClick={() => openModal(highlight)}
                />
                <p>{ commentLength > 0 ? commentLength : highlight.comments.length} comments</p>
              </div>

              
              
              
              {selectedHighlight && (
                <Modal
                  isOpen={true}
                  closeModal={closeModal}
                  selectedHighlight={selectedHighlight}
                  onPassLength={onPassLength}
                  currentUser = {currentUser}
                 
                />
              )}
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
      ) : highlights.length > 0 ? (
        renderHighlights()
      ) : (
        <div className="nothing"> <img id="nothing"src={nothing} alt="No highlights available" /> <p>No highlights available yet</p></div>
       
      )}
    </div>
  );
};

export default Main;
