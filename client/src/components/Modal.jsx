import React, { useEffect, useState } from "react";
import "../styles/Modal.css";
import ReactModal from "react-modal";
import { toast } from "react-toastify";

const Modal = ({ isOpen, closeModal, selectedHighlight, currentUser }) => 
{

    const [comments, setComments] = useState([])

    console.log(selectedHighlight)
    useEffect(() => {
        fetch(`/highlights/${selectedHighlight.id}/comments`)
        .then(r => r.json())
        .then(commentsData => setComments(commentsData))
    },[])
  const commentsData = comments.map((comment) => {
    return (
      <div className="comment" key={comment.id}>
        <div className="comment-profile">
        {comment.user.image_url&&<img src={comment.user.image_url} alt="" />}
        <p>{comment.user.name.toUpperCase()}</p>
        </div>
        
        <p id="content">{comment.content}</p>
      </div>
    );
  });

  const [content, setContent] = useState("")
  console.log(content)

  function handleSubmit(e){
    e.preventDefault()
    fetch(`/highlights/${selectedHighlight.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            content: content,
            user_id: selectedHighlight.user_id,
            highlight_id: selectedHighlight.id


        }),
      }).then((r) => {
        if (r.ok) {
          
          r.json().then((newComment) => console.log(newComment));
    
         
        } else {
          r.json().then((err) => toast.error(err.errors[0]));
        }
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
        {selectedHighlight.comments.length <= 0 ? (
          <h1>No comments yet!</h1>
        ) : (
          ""
        )}
        {commentsData}
       
        
      </div>
      <form onSubmit={handleSubmit}>
          {currentUser.image_url &&<img src={currentUser.image_url} alt="" />}
          <input type="text" placeholder="Write your comment..." onChange={(e) => setContent(e.target.value)}/>
        </form>
    </ReactModal>
  );
};

export default Modal;
