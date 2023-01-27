import React, {useState,useEffect } from 'react'
import "./CenterBar.css"
import StartChat from './StartChat/StartChat'
import Chat from './Chat/Chat'
import {db, rdb} from "../../../firebase_config"

const CenterBar = (props) => {

    const [chatUser, setChatUser] = useState([])
    const [allMessages, setAllMessages] = useState([])

    const  getUsers = () => {
        db.collection("users").onSnapshot(function(querySnapshot) {
          setChatUser(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              firstName: doc.data().firstName,
              lastName: doc.data().lastName,
              email: doc.data().email,
            })).filter((user) => {
              return user.id === props.activeFriend
            })
          )
        });
      }
  
  
      useEffect(() => {
        getUsers()
      }, [props.activeFriend])


      useEffect(() => {
        let array = []
        
        for(let i in props.messages) {
            array.push(props.messages[i])
            setAllMessages(array)
        }
        if(array.length === 0) {
            setAllMessages(array)
        }
    }, [props.messages])


   
    

    return (
        <div id="center-bar" >
            { !props.openChat && <StartChat currentUserInfo={props.currentUserInfo}/> }
            {  props.openChat && props.activeFriend &&chatUser.map(user => (
                <Chat  
                  onSend={props.onSend} 
                  user={user} 
                  allMessages={allMessages}
                  messageInput={props.messageInput}
                  changeMessageInput={props.changeMessageInput}
                  handlerChangeInputImg={props.handlerChangeInputImg}
                  handlerChangeInput={props.handlerChangeInput}
                  activeFriend={props.activeFriend}
                  activeGroup={props.activeGroup}
                  onEmojiClick={props.onEmojiClick}
                  openEmojis={props.openEmojis}
                  handleOpenEmojis={props.handleOpenEmojis} 
                  openEmojis={props.openEmojis}
                  clickActiveFriend={props.clickActiveFriend}
                  chatOptions={props.chatOptions}
                  chatUserOptions={props.chatUserOptions}
                  setOpenChat={props.setOpenChat}
                  setActiveFriend={props.setActiveFriend}
                  onlineUsers={props.onlineUsers}
                  />
            ))}
        </div>
    )
}

export default CenterBar
