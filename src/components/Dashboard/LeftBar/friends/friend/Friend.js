import React, {useEffect, useState} from 'react'
import "./Friend.css"
import img from "../../../../../assets/pro-test.png"
import { useAuth } from '../../../../../context/AuthContext'
import {db} from "../../../../../firebase_config"

const Friend = ({firstName, lastName, onlineUsers, id, activeFriend, message, fromName, fromId, saw, clickActiveFriend }) => {


const [onlineFriend, setOnlineFriend] = useState()
const { currentUser } = useAuth()


useEffect(() => {
   if(onlineUsers[id] === true) {
      setOnlineFriend(true)
   }else {
      setOnlineFriend(false)
   }
}, [onlineUsers])

let str_message = "";
let str_name="";
if(message) {
   str_message = message
}
if(fromName) {
   str_name = fromName
}
if(!fromName) {
   str_name = firstName + " " + lastName
}

   /* Friend Profile Picture */
   const [profilePictureFriend, setProfilePictureFriend] = useState()
   useEffect(() => {
      db.collection("users").doc(id).get().then((doc) => {
         if(doc.data().profilePic) {
            setProfilePictureFriend(doc.data().profilePic)
         }
      })
   }, [])

    return (
        <div className={activeFriend === id ? "friend active-friend" : "friend"} onClick={() => clickActiveFriend(id)} >
           <div className="image-section" >
              <img alt="" src={profilePictureFriend || img} />
               {onlineFriend && <div className="online" ></div>}                    
           </div>
           <div className="name-message" >
               <div className="name-friend" >
                    <h3>{str_name.length > 20 ? `${str_name.substring(0,20) + "..."}` : str_name}</h3> 
               </div>
               <p className={fromId === currentUser.uid ? "lastMessage" : saw ? "lastMessage" : "bold-text lastMessage"} >{fromId === currentUser.uid ? str_message.length > 20 ? "You: "+str_message.substring(0,20) + "......" : "You: "+str_message: str_message.length > 20 ? str_message.substring(0,20) + "......" : str_message }</p>
           </div>
           { 
              saw===false && <div className="new-message" ></div>
           }
        </div>
    )
}

export default Friend
