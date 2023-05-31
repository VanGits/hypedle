import React, { useContext, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import "../styles/Main.css";
import { FaRegComment } from "react-icons/fa";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Modal from "./Modal";
import UserContext from "../context/UserContext";
import nothing from "../assets/nothing.svg";

const Main = ({ highlights, loading, youtubePlayerOptions, setHighlights }) => {
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
          if (likedHighlight) {
            // User unliked, remove the highlightId from likes
            setLikes((prevLikes) => {
              const updatedLikes = { ...prevLikes };
              delete updatedLikes[highlightId];
              return updatedLikes;
            });
          } else {
            // User liked, update the likes with the new likeData
            response.json().then((likeData) => {
              setLikes((prevLikes) => ({
                ...prevLikes,
                [highlightId]: likeData.id,
              }));
            });
          }

          // Update the liked_users array of the corresponding highlight
          setHighlights((prevHighlights) =>
            prevHighlights.map((highlight) => {
              if (highlight.id === highlightId) {
                const likedUsers = highlight.liked_users;
                const likedUserNames = likedUsers.map((user) => user.name);

                if (likedUserNames.includes(currentUser.name)) {
                  // User already liked, remove the name
                  const updatedLikedUsers = likedUsers.filter(
                    (user) => user.name !== currentUser.name
                  );

                  return {
                    ...highlight,
                    liked_users: updatedLikedUsers,
                  };
                } else {
                  // User didn't like, add the name
                  return {
                    ...highlight,
                    liked_users: [...likedUsers, currentUser],
                  };
                }
              }
              return highlight;
            })
          );
        } else {
          return response.json().then((errorData) => {
            toast.error(errorData.errors[0]);
          });
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

  const [commentLength, setCommentLength] = useState(0);

  function onPassLength(length) {
    
    console.log(length)
    setCommentLength(length);
  }

  const renderHighlights = () => (
    <>
      {Array.isArray(highlights) &&
        highlights.map((highlight) => {
          const isLiked = likes[highlight.id];
          const likesList = highlight.likes;
          const found = likesList.some(
            (like) => like.user_id === currentUser.id
          );
          const updatedLikeCount = found
            ? isLiked
              ? likesList.length
              : likesList.length - 1
            : isLiked
            ? likesList.length + 1
            : likesList.length;

          const likedUsers = highlight.liked_users;
          const firstTwoLikedUsers = likedUsers.slice(0, 2);

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
                <div className="liked-by">
                  {highlight.liked_users.length > 0 && (
                    <p>
                      by {firstTwoLikedUsers
                        .map((user) => user.name.toUpperCase())
                        .join(", ")}
                      {likedUsers.length > 2 &&
                        ` +${likedUsers.length - 2} others`}
                    </p>
                  )}
                </div>
                <FaRegComment
                  className="highlight-reaction"
                  onClick={() => openModal(highlight)}
                />
                <p>{ commentLength && commentLength[0].highlight_id === highlight.id ? commentLength[1] : highlight.comments.length} comments</p>
              </div>

              {selectedHighlight && (
                <Modal
                  isOpen={true}
                  closeModal={closeModal}
                  selectedHighlight={selectedHighlight}
                  onPassLength={onPassLength}
                  currentUser={currentUser}
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
        <div className="nothing">
          {" "}
          <img id="nothing" src={nothing} alt="No highlights available" />{" "}
          <p>No highlights available yet</p>
        </div>
      )}
    </div>
  );
};

export default Main;
