import React, { useState } from "react";
import "../styles/Sidebar.css";
import { AiFillHome } from "react-icons/ai";
import { BsCardChecklist } from "react-icons/bs";
import { IoMdCreate } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ currentUser , setCurrentUser}) => {
  const [activeItem, setActiveItem] = useState("");
    const navigate = useNavigate()
  // Handle click event on sidebar items
  const handleItemClick = (item, path) => {
    if (activeItem !== item) {
      navigate(path);
      setActiveItem(item);
    }
  };
  function handleLogOut(e){
   e.preventDefault()
   fetch("/logout", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  
  }).then((r) => {
      if (r.ok){
          setCurrentUser(null)
          navigate("/")
          
      } 
  });
  }
  return (
    <div className="sidebar">
      <div className="profile">
        {currentUser.image_url &&<img src={currentUser.image_url} alt="" />}
        {currentUser && <><h2>Hello, {currentUser.name.toUpperCase()}</h2></>}
      </div>
      <div className={activeItem === 'item1' ? 'sidebar-element active' : 'sidebar-element'} onClick={() => handleItemClick("item1", "/home")}>
        <AiFillHome />
        <h2>Home</h2>
      </div>
      <div className={activeItem === 'item2' ? 'sidebar-element active' : 'sidebar-element'} onClick={() => handleItemClick("item2", "/my-highlights")}>
        <BsCardChecklist />
        <h2>My Highlights</h2>
      </div>
      <div className={activeItem === 'item3' ? 'sidebar-element active' : 'sidebar-element'} onClick={() => handleItemClick("item3", "/create-highlight")}>
        <IoMdCreate />
        <h2>Create Highlight</h2>
      </div>
      <div className={activeItem === 'item4' ? 'sidebar-element active' : 'sidebar-element'} onClick={() => handleItemClick("item4", "/game-categories")}>
        <BiCategoryAlt />
        <h2>Game Categories</h2>
      </div>
      <div className="logout-wrapper">
      <button onClick={handleLogOut}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
