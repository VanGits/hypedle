import React, { useEffect, useState } from "react";
import "../styles/Modal.css";
import ReactModal from "react-modal";
import { toast } from "react-toastify";

import { BiMessageSquareEdit } from "react-icons/bi";
import { AiFillDelete, AiFillSave } from "react-icons/ai";

const Modal = ({ isOpen, closeModal, selectedHighlight, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editedCommentId, setEditedCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");

  useEffect(() => {
    fetch(`/highlights/${selectedHighlight.id}/comments`)
      .then((r) => r.json())
      .then((commentsData) => {
        setComments(commentsData);
        setIsLoading(false); // Set loading state to false when comments are fetched
      });
  }, []);

  function handleCommentEdit(e, id) {
    setEditedCommentId(id);
    const comment = comments.find((comment) => comment.id === id);
    setEditedCommentContent(comment.content);
    
  }

  function handleCommentUpdate(e, id) {
    e.preventDefault();
    fetch(`/highlights/${selectedHighlight.id}/comments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: editedCommentContent,
      }),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("Failed to update comment.");
        }
      })
      .then((updatedComment) => {
        const updatedComments = comments.map((comment) => {
          if (comment.id === updatedComment.id) {
            return updatedComment;
          } else {
            return comment;
          }
        });
        setComments(updatedComments);
        setEditedCommentId(null);
        setEditedCommentContent("");
        toast.success("Comment updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update comment.");
      });
  }

  function handleCommentDelete() {
    // Implement the delete logic here
  }

  const commentsData = comments.map((comment) => (
    <div className="comment" key={comment.id}>
      <div className="comment-profile">
        {comment.user.image_url && <img src={comment.user.image_url} alt="" />}
        <p>{comment.user.name.toUpperCase()}</p>
        {comment.user.id === currentUser.id ? (
          <div className="comment-edit-wrapper">
            {editedCommentId === comment.id ? (
              <AiFillSave className="comment-btn" onClick={(e) => handleCommentUpdate(e, comment.id)}/>
            ) : (
              <BiMessageSquareEdit className="comment-btn" onClick={(e) => handleCommentEdit(e, comment.id)} />
            )}
            <AiFillDelete className="comment-btn" onClick={(e) => handleCommentDelete(e)} />
          </div>
        ) : (
          ""
        )}
      </div>
      {editedCommentId === comment.id ? (
        <input
        type="text"
        value={editedCommentContent}
        onChange={(e) => setEditedCommentContent(e.target.value)}
      />
        
      ) : (
        <p id="content">{comment.content}</p>
      )}
    </div>
  ));

  const [content, setContent] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`/highlights/${selectedHighlight.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
        user_id: selectedHighlight.user_id,
        highlight_id: selectedHighlight.id,
      }),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("Failed to add comment.");
        }
      })
      .then((newComment) => {
        console.log(newComment);
        setContent("");
        // Update the comments state with the new comment
        setComments((prevComments) => [...prevComments, newComment]);
        toast.success("Comment successfully sent!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to add comment.");
      });
  }

  return (
    <ReactModal
      isOpen={isOpen}
      className="modal"
      overlayClassName="modal-overlay"
      onRequestClose={closeModal}
    >
      <div className="modal-content">
        <div className="profile">
          {selectedHighlight.user.image_url && (
            <img src={selectedHighlight.user.image_url} alt="" />
          )}
          <h3>{selectedHighlight.user.name.toUpperCase()}</h3>
        </div>
        <h2>Title: {selectedHighlight.title}</h2>
        <p>Description: {selectedHighlight.description}</p>
        {isLoading ? (
          <h1>Loading comments...</h1>
        ) : (
          <>
            {selectedHighlight.comments.length <= 0 ? (
              <h1>No comments yet!</h1>
            ) : (
              ""
            )}
            {commentsData}
          </>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        {currentUser.image_url && <img src={currentUser.image_url} alt="" />}
        <input
          type="text"
          placeholder="Write your comment..."
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />
      </form>
    </ReactModal>
  );
};

export default Modal;
