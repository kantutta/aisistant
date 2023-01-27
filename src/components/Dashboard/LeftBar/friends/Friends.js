import React, {useState, useEffect} from 'react'
import "./Friends.css"
import Friend from './friend/Friend'
import {useAuth} from "../../../../context/AuthContext"
import {db} from "../../../../firebase_config"


const Friends = ({findFriend, onlineUsers, activeFriend, clickActiveFriend, friends, messagesDB}) => {

  /* Friends React States */
  const [users, setUsers] = useState([])
  
  /* Use Context */
  const {currentUser} = useAuth()
  

  /* Get Users */
  const  getUsers = () => {
      db.collection("users").onSnapshot(function(querySnapshot) {
       setUsers(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
          }))
        );
      });
  }

  useEffect(() => {
    getUsers()

    console.log(users.length)

    for(let i in friends){
      console.log(friends[i].id)

      db.collection("users").doc(currentUser.uid).collection("messages").doc(friends[i].id).update({
        profile: "blublublu"
      })

    }

    

  }, [])

  useEffect(() => {
    if(activeFriend) {
      friends.filter((f) => {
        return f.id === activeFriend
      }).map((f) => {
        if(!f.saw) {
          db.collection("users").doc(currentUser.uid).collection("messages").doc(activeFriend).update({
            saw: true,
          })
        }
      })
    }

      db.collection("users").doc(currentUser.uid).collection("messages").doc(activeFriend).get().then((doc) => {
        if(doc.exists) {
          if(doc.data().call) {
            
          }
        }
      })
  }, [clickActiveFriend])

  


    return (
        <div className="friends" >
         
          {/* If you have no friends */}
          {!activeFriend && findFriend.length < 2 && friends.length === 0 && 
            <p className="no-friends" >You have no friends list here Search for someone to start a conversation</p>
          }
           
          {/* Searching */}
          {findFriend.length > 1 && users.filter(user => {
              return user.id !== currentUser.uid
          }).filter(user => {
              const fn = user.firstName;
              const ln = user.lastName;
              const fullName = fn +" "+ln
              const fullName_find = fullName.toLowerCase().includes(findFriend.toLowerCase())
              return fullName_find
          }).map(user => (
              <Friend  {...user} onlineUsers={onlineUsers} key={user.id} clickActiveFriend={clickActiveFriend} activeFriend={activeFriend}/>  
          ))}
            
            
          {/* Friends List */}
          {
            findFriend.length < 2 && friends.slice(0).reverse().map(friend => (
              <Friend  {...friend} key={friend.id}  onlineUsers={onlineUsers} clickActiveFriend={clickActiveFriend} activeFriend={activeFriend}/>
            ))
          }

          {/* Active Friend */}
          {activeFriend && 
            users.filter((u) => {
              return u.id !== currentUser.uid && u.id === activeFriend && friends.filter(f => {return f.id === u.id}).map(u => {return u.id}).length === 0
            }).map((user) => (
              <Friend  {...user}  key={user.id} onlineUsers={onlineUsers} clickActiveFriend={clickActiveFriend} activeFriend={activeFriend}/> 
            ))
          }
            
            {
            messagesDB.map(a => {
                console.log(a)
            })
         }

        </div>
    )
}

export default Friends
