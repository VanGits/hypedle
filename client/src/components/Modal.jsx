import React, { useEffect, useState } from "react";
import "../styles/Modal.css";
import ReactModal from "react-modal";
import { toast } from "react-toastify";

import { BiMessageSquareEdit } from "react-icons/bi";
import { AiFillDelete, AiFillSave } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";

import noComment from "../assets/no-comment.svg";

const Modal = ({
  isOpen,
  closeModal,
  selectedHighlight,
  currentUser,
  onPassLength,
}) => {
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
          return r.json().then((updatedComment) => {
            const updatedComments = comments.map((comment) =>
              comment.id === updatedComment.id ? updatedComment : comment
            );
    
            setComments(updatedComments);
            setEditedComment({ id: null, content: "" });
            toast.success("Comment updated successfully!");
          })
        } else {
          return r.json().then(data => toast.error(data.errors[0]))
         
        }
      })
      
      
  };



  const handleCommentDelete = (e, id) => {
    e.preventDefault();

    // Find the comment to be deleted
    const deletedComment = comments.find((comment) => comment.id === id);

    // Store the deleted comment
    const storedDeletedComment = { ...deletedComment };

    // Remove the comment from the UI
    const updatedComments = comments.filter((comment) => comment.id !== id);
    setComments(updatedComments);

    fetch(`/highlights/${selectedHighlight.id}/comments/${id}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (r.ok) {
          return { success: true };
        } else {
          r.json().then(
            (data) => toast.error(data.errors[0])
          )
          
        }
      })
      .then((response) => {
        if (response.success) {
          onPassLength([storedDeletedComment, comments.length - 1]);
          setEditedComment({ id: null, content: "" });
          toast.success("Comment deleted successfully!");

         
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error);

       
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
          return r.json() .then((newComment) => {
            setNewComment("");
            setComments((prevComments) => [newComment, ...prevComments]);
            onPassLength([newComment, comments.length + 1]);
            toast.success("Comment successfully sent!");
    
            // Update the comments length
          })
          .catch((error) => {
            console.error(error);
            
          });
        } else {
          return r.json().then(data => toast.error(data.errors[0]))
        }
      })
     
  };

  let commentsData;

  if (isLoading) {
    // Loading state
    commentsData = (
      <div className="loading-comments">
        {[...Array(3)].map((_, index) => (
          <div className="comment-placeholder-wrapper" key={index}>
            <div className="skeleton-load skeleton-profile-pic"></div>
            <div className="comment-placeholder"></div>
          </div>
        ))}
      </div>
    );
  } else if (comments.length > 0) {
    // Display comments
    commentsData = comments.map((comment) => (
      <div className="comment" key={comment.id}>
        <div className="comment-profile">
          {comment.user.image_url && (
            <img src={comment.user.image_url} alt="" />
          )}
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
  } else {
    // No comments yet
    commentsData = (
      <div className="no-comment">
        <p>No comments yet!</p>
      </div>
    );
  }

  return (
    <ReactModal
      isOpen={isOpen}
      className="modal"
      overlayClassName="modal-overlay"
      onRequestClose={closeModal}
    >
      <RxCross1 onClick={closeModal} id="exit"/>
      <div className="modal-content">
        <div className="profile">
          {selectedHighlight.user.image_url && (
            <img src={selectedHighlight.user.image_url} alt="" />
          )}
          <h3>{selectedHighlight.user.name.toUpperCase()}</h3>
        </div>
        <h2>Title: {selectedHighlight.title}</h2>
        <p>Description: {selectedHighlight.description}</p>
        {commentsData}
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
