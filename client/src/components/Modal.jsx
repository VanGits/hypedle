import React, { useEffect, useState } from "react";
import "../styles/Modal.css";
import ReactModal from "react-modal";
import { toast } from "react-toastify";

import { BiMessageSquareEdit } from "react-icons/bi";
import { AiFillDelete, AiFillSave } from "react-icons/ai";

const Modal = ({ isOpen, closeModal, selectedHighlight, currentUser, onPassLength }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editedComment, setEditedComment] = useState({ id: null, content: "" });
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`/highlights/${selectedHighlight.id}/comments`)
      .then((r) => r.json())
      .then((commentsData) => {
        setComments(commentsData);
        setIsLoading(false);
      });
  }, []);

  const handleCommentEdit = (id) => {
    const comment = comments.find((comment) => comment.id === id);
    setEditedComment({ id, content: comment.content });
  };

  const handleCommentUpdate = (e, id) => {
    e.preventDefault();
    fetch(`/highlights/${selectedHighlight.id}/comments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: editedComment.content,
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
        const updatedComments = comments.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        );
       
        setComments(updatedComments);
        setEditedComment({ id: null, content: "" });
        toast.success("Comment updated successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update comment.");
      });
  };

  const handleCommentDelete = (e, id) => {
    e.preventDefault();
    fetch(`/highlights/${selectedHighlight.id}/comments/${id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          return { success: true };
        } else {
          throw new Error("Failed to delete comment.");
        }
      })
      .then((response) => {
        if (response.success) {
          const updatedComments = comments.filter((comment) => comment.id !== id);
          setComments(updatedComments);
          
          onPassLength(comments.length - 1)
          setEditedComment({ id: null, content: "" });
          toast.success("Comment deleted successfully!");
  
          // Update the comments length
         
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to delete comment.");
      });
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    fetch(`/highlights/${selectedHighlight.id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: newComment,
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
        setNewComment("");
        setComments((prevComments) => [newComment, ...prevComments]);
        onPassLength(comments.length + 1)
        toast.success("Comment successfully sent!");
  
        // Update the comments length
       
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to add comment.");
      });
  };

  const commentsData = comments.map((comment) => (
    <div className="comment" key={comment.id}>
      <div className="comment-profile">
        {comment.user.image_url && <img src={comment.user.image_url} alt="" />}
        <p>{comment.user.name.toUpperCase()}</p>
        {comment.user.id === currentUser.id && (
          <div className="comment-edit-wrapper">
            {editedComment.id === comment.id ? (
              <AiFillSave
                className="comment-btn"
                onClick={(e) => handleCommentUpdate(e, comment.id)}
              />
            ) : (
              <BiMessageSquareEdit
                className="comment-btn"
                onClick={() => handleCommentEdit(comment.id)}
              />
            )}
            <AiFillDelete
              className="comment-btn"
              onClick={(e) => handleCommentDelete(e, comment.id)}
            />
          </div>
        )}
      </div>
      {editedComment.id === comment.id ? (
        <input
          type="text"
          value={editedComment.content}
          onChange={(e) =>
            setEditedComment({ id: comment.id, content: e.target.value })
          }
        />
      ) : (
        <p id="content">{comment.content}</p>
      )}
    </div>
  ));

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
            <div className="no-comment">
          <h1>Loading comments...</h1>
            </div>
        ) : (
          commentsData.length > 0 ? commentsData : <div className="no-comment"><h1>No comments yet!</h1></div>
        )}
      </div>
      <form onSubmit={handleCommentSubmit}>
        {currentUser.image_url && <img src={currentUser.image_url} alt="" />}
        <input
          type="text"
          placeholder="Write your comment..."
          onChange={(e) => setNewComment(e.target.value)}
          value={newComment}
        />
      </form>
    </ReactModal>
  );
};

export default Modal;
