import React from 'react'
import "./Message.css"
import { useAuth } from '../../../../../context/AuthContext'
import { sdb } from "../../../../../firebase_config"

const Message = ({chatOptions, infoColor, info, id, fromId, message, timestamp, file, activeFriend, img, messages, fileImg, allMessages, imgUrl}) => {

    const {currentUser} = useAuth()

    /* Handle Downloader Click on File/FileImg */
    const handleDownloader = () => {
        if(file && fromId === currentUser.uid) {
            sdb
            .ref("message-files")
            .child(currentUser.uid + "/" + activeFriend + "/" + "files/" + id + "/" + message)
            .getDownloadURL()
            .then(url => {
                const a = document.createElement("a")
                a.setAttribute("href", url)
                a.setAttribute("download", message)
                a.setAttribute("target", "_blank")
                a.click()
                console.log(url)
            }).catch((error) => {
                console.log(error.code)
            });
            console.log(id)
        }else if(file && fromId === activeFriend) {
            sdb
            .ref("message-files")
            .child(activeFriend + "/" + currentUser.uid + "/" + "files/" + id + "/" + message)
            .getDownloadURL()
            .then(url => {
                const a = document.createElement("a")
                a.setAttribute("href", url)
                a.setAttribute("download", message)
                a.setAttribute("target", "_blank")
                a.click()
                console.log(url)
            }).catch((error) => {
                console.log(error.code)
            });
            console.log(id)
        }
    }

    return (
        <>
          {img === false && !info && <div id="message" className={fromId === currentUser.uid ? "my-message" : "other-message"} >
           <div onClick={handleDownloader} style={{background: fromId === currentUser.uid ? chatOptions.chatTheme : "#F2F2F2"}} >
               <p className={file ? "line" : ""} >{message}</p>
           </div>
        </div>}
        {img &&  <div id="message-img" className={fromId === currentUser.uid ? "my-message" : "other-message"}>
             <img alt="" src={imgUrl} className="me-img" />
        </div> }
        {info && <div id="message-info" className={fromId === currentUser.uid ? "my-message info" : "other-message info"} >
           <div className="message-info-content" >
               <p>{message}</p> 
               {!infoColor ? null : <div className="color-showness" style={{background: infoColor}}></div> }
           </div>
        </div>}
        </>
        
    )
}

export default Message
