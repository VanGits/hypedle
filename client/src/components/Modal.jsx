import React from "react";
import "../styles/Modal.css";
import ReactModal from "react-modal";


const Modal = ({
  isOpen,
  closeModal,
  selectedHighlight,
  currentUser
  
}) => {

    const comments = selectedHighlight.comments.map((comment) => {
        <div className="comment-section">
            <h1>{comment.content}</h1>
        </div>
    })
  return (
    <ReactModal
      isOpen={isOpen}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <div className="profile">
          {selectedHighlight.user.image_url && (
            <img src={selectedHighlight.user.image_url} alt="" />
          )}
          <h3>{selectedHighlight.user.name.toUpperCase()}</h3>
        </div>

        <h2>{selectedHighlight.title}</h2>
        <h1>{selectedHighlight.comments.length}</h1>
            
        <p>{selectedHighlight.description}</p>
        {selectedHighlight.comments.length <= 0 ? <h1>No comments yet!</h1>: comments}

        <form action="">
            <img src={currentUser.image_url} alt="" />
            <input type="text" placeholder="Write your comment..."/>
        </form>
        <button onClick={closeModal}>Close</button>
      </div>
    </ReactModal>
  );
};

export default Modal;
