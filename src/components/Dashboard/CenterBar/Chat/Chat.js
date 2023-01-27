import React, {useState, useEffect} from 'react'
import "./Chat.css"
import pro_test from "../../../../assets/pro-test.png"
import { ControlPoint, Mood, MoreVert, Photo, Send } from '@material-ui/icons'
import Message from "./Message/Message"
import Picker from "emoji-picker-react";
import SettingsChat from './SettingsChat/SettingsChat'
import { rdb, db } from "../../../../firebase_config"
import { useAuth } from '../../../../context/AuthContext'
import moment from "moment"

const Chat = (props) => {

    const [more, setMore] = useState(false)
    const [openSettingsChat, setOpenSettingsChat] = useState(false)
    const [openInfoChat, setOpenInfoChat] = useState(false)
    const [newName, setNewName] = useState()
    
    const { currentUser } = useAuth()

    /* Push Enter */
    const keyDownHandler = (e) => {
        if(e.keyCode === 13) {
            props.onSend()
        }
    }
    

    /* New Name Chat Input */
    const handleChangeInputNewName = (e) => {
        setNewName(e.target.value)
    }
  
    useEffect(() => {
        if(openSettingsChat) {
            if(props.chatOptions.chatName) {
                setNewName(props.chatOptions.chatName) 
            }else {
                setNewName(props.user.firstName + " " + props.user.lastName) 
            }
        }    
    }, [openSettingsChat])
    



    /* Open Input File Handler */
    const handlerUploadFiles = () => {
       
        const fileSelector = document.querySelector('.file_input');
        var clickEvent = new MouseEvent('click', {bubbles: true});
        fileSelector.dispatchEvent(clickEvent);        

    }

    const handlerUploadFilesImg = () => {
       
        const fileSelector = document.querySelector('.file_input_img');
        var clickEvent = new MouseEvent('click', {bubbles: true});
        fileSelector.dispatchEvent(clickEvent);        

    }

    const handleMore = (role) => {
        if(role==="toggle") {
            setMore(!more)
        }
        if(role==="shutdown") {
            setMore(false)
        }
    }

    useEffect(() => {
        handleMore("shutdown")
        setOpenSettingsChat(false)
    }, [props.clickActiveFriend])


    /* Open Settings Chat */
    const handleSettingsChat = () => {
        setOpenSettingsChat(true)
        handleMore("shutdown")
    }

    /* Open Info Chat */
    const handleInfoChat = () => {
        setOpenInfoChat(true)
        handleMore("shutdown")
    }


    /* Change Theme */
    const handleClickChangeTheme = (color) => {
        // setNewTheme(color)
        if(props.chatOptions.chatTheme !== color) {
            rdb.ref('messages/' + currentUser.uid + props.activeFriend).child("options").update({
                chatTheme: color
             })
             rdb.ref('messages/' + props.activeFriend + currentUser.uid).child("options").update({
                chatTheme: color
             })
    
             const autoId = rdb.ref('messages/' + currentUser.uid + props.activeFriend).push().key
    
             rdb.ref('messages/' + props.activeFriend + currentUser.uid).child(autoId).set({
                message: props.chatUserOptions.chatName + " changed chat theme to",
                timestamp: new Date().valueOf(),
                fromId: currentUser.uid,
                toId: props.activeFriend, 
                id: autoId,
                file:false,
                img: false,
                info: true,
                infoColor: color,
              });
    
              rdb.ref('messages/' + currentUser.uid + props.activeFriend).child(autoId).set({
                message: "You" + " changed chat theme to",
                timestamp: new Date().valueOf(),
                fromId: currentUser.uid,
                toId: props.activeFriend, 
                id: autoId,
                file:false,
                img: false,
                info: true,
                infoColor: color,
              });
    
    
             handleMore("shutdown")
             setOpenSettingsChat(false)
        }else{
            alert("It is the same theme, choose another or no one")
        }

    }

    /* Change Chat Name */
    const handleClickChatName = (n) => {
        if(props.chatOptions.chatName !== n && n.length <= 30) {
            rdb.ref('messages/' + currentUser.uid + props.activeFriend).child("options").update({
                chatName: n
             })

             db.collection("users").doc(currentUser.uid).collection("messages").doc(props.activeFriend).update({
                fromName: {0:n},
              })

              const autoId = rdb.ref('messages/' + currentUser.uid + props.activeFriend).push().key
    
              rdb.ref('messages/' + props.activeFriend + currentUser.uid).child(autoId).set({
                 message: props.chatUserOptions.chatName  + " changed your nick name to " + n,
                 timestamp: new Date().valueOf(),
                 fromId: currentUser.uid,
                 toId: props.activeFriend, 
                 id: autoId,
                 file:false,
                 img: false,
                 info: true,
                 infoColor: false,
               });
     
               rdb.ref('messages/' + currentUser.uid + props.activeFriend).child(autoId).set({
                 message: "You" + " changed " + props.user.firstName + "'s nick name to " + n,
                 timestamp: new Date().valueOf(),
                 fromId: currentUser.uid,
                 toId: props.activeFriend, 
                 id: autoId,
                 file:false,
                 img: false,
                 info: true,
                 infoColor: false,
               });
     


             handleMore("shutdown")
             setOpenSettingsChat(false)
        }
      
        if(n.length > 30) {
            alert("Name too large. (Only 30 letters)." + "You have "+n.length+" letters")
        }


    } 

    /* Delete Chat */
    const handleClickDeleteChat = () => {
        rdb.ref('messages/' + currentUser.uid + props.activeFriend).remove()

        db.collection("users").doc(currentUser.uid).collection("messages").doc(props.activeFriend).delete()
        props.setActiveFriend()

        handleMore("shutdown")
        setOpenSettingsChat(false)

        props.setOpenChat(false)

    }

    /* Friend Profile Picture */
    const [profilePictureFriend, setProfilePictureFriend] = useState()
    useEffect(() => {
        if(props.activeFriend) {
            db.collection("users").doc(props.activeFriend).get().then((doc) => {
            if(doc.data().profilePic) {
                setProfilePictureFriend(doc.data().profilePic)
            } else {
                setProfilePictureFriend(null)
            }
            })
        }
    }, [props.clickActiveFriend])


    /* handleCloseChat */
    const handleCloseChat = () => {
        props.setActiveFriend()

        document.getElementById("center-bar").style.display="none"

    }

    return (
        <div id="chat" >
            { more && 
            <div className="more-chat" >
              <div onClick={handleSettingsChat} className="content-more-chat" >
                  <span className="material-icons">settings</span>
                  <h4>Settings</h4>
              </div>
              <div onClick={handleInfoChat} className="content-more-chat" >
                  <span className="material-icons">info</span>
                  <h4>Information</h4>
              </div>
            </div>
            }
            <div className="top-chat-content" > 
               { !openSettingsChat && !openInfoChat &&  <>
                 { props.activeFriend  &&
                 <div className="left-top-chat-content" >
                     <div className="back-to-friend"  onClick={() => handleCloseChat()} >
                        <span class="material-icons">arrow_back</span>
                     </div>
                    <div  className="profile-chat"  >
                        <img alt="" src={profilePictureFriend || pro_test} />
                        <h3>{props.chatOptions.chatName || `${props.user.firstName} ${props.user.lastName}`}</h3>
                    </div>
                </div> }
            {props.allMessages.length > 0 && <MoreVert onClick={() => {handleMore("toggle")}}/>}</>}
                {openSettingsChat && <>
                    
                    <div className="back-from-settings" onClick={() => {setOpenSettingsChat(false)}} >
                         <span class="material-icons">arrow_back</span>
                         <h4>Settings</h4>
                    </div>
                    
                </>}
                {openInfoChat && <>
                    
                    <div className="back-from-settings" onClick={() => {setOpenInfoChat(false)}} >
                         <span class="material-icons">arrow_back</span>
                         <h4>Information</h4>
                    </div>
                    
                </>}
            </div>
            {props.allMessages.length > 0 && !openSettingsChat && !openInfoChat && 
            <div onClick={() => {handleMore("shutdown")}} className="center-chat-content" >
                <div className="chat-messages-container" >
                   
                    {props.allMessages.map((message) => (
                        <Message chatOptions={props.chatOptions} key={message.id} {...message}  activeFriend={props.activeFriend} allMessages={props.allMessages}/>
                    ))}
                </div>
                { props.openEmojis &&  <div className="emoji-x" >
             <Picker onEmojiClick={props.onEmojiClick} disableSkinTonePicker={true} />
            </div> }
            </div>
            }
           
            {props.allMessages.length === 0 && !openInfoChat && props.activeFriend && 
            <div className="center-chat-content-no-messages" >
                <div className="chat-messages-container" >
                    <img alt="" src={profilePictureFriend || pro_test} />
                    <h3>{props.user.firstName}{" "}{props.user.lastName}</h3> 
                </div>
            </div>}
         
            {!openSettingsChat && !openInfoChat && <div className="bottom-chat-content" >
                <input type="file" className="file_input" onChange={props.handlerChangeInput} />
                <input type="file" className="file_input_img" accept="image/png, image/gif, image/jpeg" onChange={props.handlerChangeInputImg} />
                <div onClick={() => {handleMore("shutdown")}} id="bottom-bar-chat" >
                    <div className="chat-input" >
                        <input type="text" placeholder="Write a message..." value={props.messageInput} onChange={props.changeMessageInput} onKeyUp={keyDownHandler}/>
                        {
                          props.allMessages.length > 0   &&
                        <div className="input-interactive" >
                            <ControlPoint onClick={handlerUploadFiles} style={{fill: props.chatUserOptions.chatTheme || "#625AC0"}} />
                            <Photo onClick={handlerUploadFilesImg} style={{fill: props.chatUserOptions.chatTheme || "#625AC0"}}  />
                            <Mood onClick={props.handleOpenEmojis}  style={{fill: props.chatUserOptions.chatTheme || "#625AC0"}}/>
                        </div>
                        }
                    </div>
                    <div className="send" >
                        <Send onClick={props.onSend} style={{fill: props.chatUserOptions.chatTheme || "#625AC0"}}  />
                    </div>
                </div>
            </div>}
            {openSettingsChat && <SettingsChat handleClickDeleteChat={handleClickDeleteChat} handleClickChatName={handleClickChatName} newName={newName} handleChangeInputNewName={handleChangeInputNewName} handleClickChangeTheme={handleClickChangeTheme} chatOptions={props.chatOptions} />}
            {openInfoChat && <div className="info-chat" >
               <h4>{props.chatOptions.chatName}</h4>
               <p>Status: <em>{props.onlineUsers[props.activeFriend] === true ? "online" : "offline"}</em></p>
               <p>Created: <em>{moment(props.chatUserOptions.createdTime).format('L')}</em></p>
               <div className="info-theme" >
                   <p>Chat Theme </p>
                   <div style={{background: props.chatUserOptions.chatTheme}} ></div>
               </div>
            </div>}
        </div>
    )
}

export default Chat
