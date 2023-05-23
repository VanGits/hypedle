import React, { useState } from 'react';
import "../styles/Sidebar.css"

const Sidebar = ({currentUser}) => {
   
   
    return (
        
        <div className="sidebar">
            <div className="profile">
                {currentUser &&<h2>Hello, {currentUser.name.toUpperCase()}</h2>}
            </div>
            
        </div>
    );
}

export default Sidebar;
