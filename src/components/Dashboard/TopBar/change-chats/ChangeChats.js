import React from 'react'
import "./ChangeChats.css"
import {Link} from "react-router-dom"

const ChangeChats = ({active}) => {
    return (
        <div className="change-chats" >
            <Link to="/" className={active === "Chats" ? "active" : ""} >Chats</Link>
            <Link to="/groups" className={active === "Groups" ? "active" : ""} >Groups</Link>
        </div>
    )
}

export default ChangeChats
