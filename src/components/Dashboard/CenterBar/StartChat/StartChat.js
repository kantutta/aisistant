import React from 'react'
import "./StartChat.css"
import pro_test from "../../../../assets/pro-test.png"
import {db} from "../../../../firebase_config"


const StartChat = (props) => {

    return (
        <div id="start-chat" >
            <div className="start-chat-container" >
                <h2>{props.currentUserInfo[0].firstName + " " +props.currentUserInfo[0].lastName}</h2>
                <img alt="" src={props.currentUserInfo[0].profilePic ||  pro_test} />
                <p>Search for someone to start a conversation. <br/> Click , write, send messages and make new friends</p>
            </div>
        </div>
    )
}

export default StartChat
