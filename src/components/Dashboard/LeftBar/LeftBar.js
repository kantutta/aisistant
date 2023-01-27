import React, {useEffect, useState} from 'react'
import "./LeftBar.css"
import FindInput from './find-input/FindInput'
import Friends from './friends/Friends'
import { useAuth } from '../../../context/AuthContext'

const LeftBar = (props) => {

    const [messagesDB, setMessagesDB] = useState([])
    
    const {currentUser} = useAuth()

    useEffect(() => {
        props.getFriends()
        
    }, [])
    
      

    useEffect(() => {
        let array = []
        
        for(let i in props.alMes) {
            array.push(props.alMes[i])
            setMessagesDB(array)
        }
        if(array.length === 0) {
            setMessagesDB(array)
        }        
    }, [props.alMes])
    

    return (
        <div id="left-bar-main" >
            <div className="top-left-search" >
                <FindInput 
                    changeFindFriend={props.changeFindFriend}
                    findFriend={props.findFriend}
                />
            </div> 
            <Friends 
                friends={props.friends} 
                messagesDB={messagesDB}
                findFriend={props.findFriend} 
                onlineUsers={props.onlineUsers}
                activeFriend={props.activeFriend} 
                clickActiveFriend={props.clickActiveFriend} 
                changeFindFriend={props.changeFindFriend} 
                newFriendLoading={props.newFriendLoading} 
            />          

        {console.log(typeof(props.alMes))}            
          

        </div>
    )
}

export default LeftBar
