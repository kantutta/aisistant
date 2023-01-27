import React, {useState, useEffect, useCallback} from 'react'
import "./Dashboard.css"
import LeftBar from './LeftBar/LeftBar'
import TopBar from './TopBar/TopBar'
import CenterBar from './CenterBar/CenterBar'
import {useAuth} from "../../context/AuthContext"
import { useUsers } from '../../context/UsersContext'
import {sdb, rdb, db} from "../../firebase_config"

const Dashboard = () => {

  /* Dashboard React States */
  const [activeFriend, setActiveFriend] = useState()
  const [openChat, setOpenChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState("")
  const [users, setUsers] = useState([])
  const [newFriendLoading, setNewFriendLoading] = useState(false)
  const [friends, setFriends] = useState([])
  const [findFriend, setFindFriend] = useState("")
  const [file, setFile] = useState(null)  
  const [fil, setFil] = useState(null)  
  const [fileImg, setFileImg] = useState(null)
  const [filImg, setFilImg] = useState(null)
  const [openEmojis, setOpenEmojis] = useState(false)
  const [chatUser, setChatUser] = useState([])
  const [chatOptions, setChatOptions] = useState([])
  const [chatUserOptions, setChatUserOptions] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])

  /* Use Context */
  const { currentUser } = useAuth()
  const { currentUserInfo } = useUsers()
   
  /* Get Chat User by active friend id */
  const  getChatUser = () => {
    db.collection("users").onSnapshot(function(querySnapshot) {
      setChatUser(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email,
        })).filter((user) => {
          return user.id === activeFriend
        })
      )
    });
  }

  /* Emoji Picker */
  const onEmojiClick = (event, emojiObject) => {
    setMessageInput(messageInput + emojiObject.emoji);
  };

  const handleOpenEmojis = () => {
    setOpenEmojis(!openEmojis)
  }



  /* Change Inputs */
  const changeFindFriend = (e) => {
      setFindFriend(e.target.value)
  }

  const changeMessageInput = (e) => {
      setMessageInput(e.target.value)
  }

   
  /* Pick File in Message */
  const handlerChangeInput = (e) => {
      let file = e.target.files[0];
      if(file) {
        const reader = new FileReader();
        reader.onload = function(){
          const result = reader.result;
          setFile(result)
        }
        reader.readAsDataURL(file);
      }

      if(file && file.size > 25000000) {
        alert("Too big file !")
        setMessageInput()
      }else if(file && file.size < 25000000 ) {
        setMessageInput(file.name)
      }

      setFil(file);
  }

  /* Pick Image in Message */
  const handlerChangeInputImg = (e) => {
    let fileImg = e.target.files[0];
    if(fileImg) {
      const reader = new FileReader();
      reader.onload = function(){
        const result = reader.result;
        setFileImg(result)
      }
      reader.readAsDataURL(fileImg);
    }

    setFilImg(fileImg);

    if(fileImg && fileImg.size > 10000000) {
      alert("Too big image !")
      setMessageInput()
    }else if(fileImg && fileImg.size < 10000000 ) {
      setMessageInput(fileImg.name)
    }
  }

  /* Get All Users */
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

    


      
  /* Get Messages */
  const getMessages = () => {
      rdb.ref('messages/' + currentUser.uid  + activeFriend).on('value', (snapshot) => {
          if (snapshot.exists()) {
              setMessages(snapshot.val())
            } else {
              setMessages("")
            }
      }) 
  }

  /* Click on friend - active */  
  const clickActiveFriend = useCallback((id) => {
      setOpenChat(false)
      setTimeout(() => {
        setActiveFriend(id)
      }, 50)
      setFindFriend("")
      if(id) {
           document.getElementById("center-bar").style.display="block"
           setOpenChat(true)
           setOpenEmojis(false)
           setMessageInput("")
      }else {
          setOpenChat(false)
      }
  }, [activeFriend])


  /* Get Chat Options */ 
  const getChatOptions = () => {
      rdb.ref('messages/' + currentUser.uid  + activeFriend + "/options").on('value', (snapshot) => {
          if (snapshot.exists()) {
              setChatOptions(snapshot.val())
          } else {
              setChatOptions("no")
          }
      }) 
  }
  
  /* Get Chat User Options */
  const getChatUserOptions = () => {
      rdb.ref('messages/' + activeFriend + currentUser.uid + "/options").on('value', (snapshot) => {
          if (snapshot.exists()) {
              setChatUserOptions(snapshot.val())
          } else {
              setChatUserOptions("no")
          }
      }) 
  }
  

  /* Function Send Message */
  const sendMessage = (fromId, toId, message, timestamp,saw) => {
            
    const autoId = rdb.ref('messages/' + currentUser.uid + activeFriend).push().key
    
    if(file) {
      rdb.ref('messages/' + activeFriend + currentUser.uid).child(autoId).set({
        message: message,
        timestamp: timestamp,
        fromId: fromId,
        toId: toId, 
        id: autoId,
        file:true,
        img: false
      });
    }else {
      rdb.ref('messages/' + activeFriend + currentUser.uid).child(autoId).set({
          message: message,
          timestamp: timestamp,
          fromId: fromId,
          toId: toId, 
          id: autoId,
          file:false,
          img: false
        });
    }


    if(file) {
      rdb.ref('messages/' + currentUser.uid + activeFriend).child(autoId).set({
        message: message,
        timestamp: timestamp,
        fromId: fromId,
        toId: toId, 
        id: autoId,
        file:true,
        img: false
    });
    }
    else {
      rdb.ref('messages/' + currentUser.uid + activeFriend).child(autoId).set({
        message: message,
        timestamp: timestamp,
        fromId: fromId,
        toId: toId, 
        id: autoId,
        file:false,
        img: false
    });
    }


    /* To DB in users/friend */
    db.collection("users").doc(currentUser.uid).collection("messages").doc(activeFriend).set({
      message: message,
      timestamp: timestamp,
      fromId: fromId,
      toId: toId, 
      id: autoId, 
      fromName: users.filter(user => {return user.id === activeFriend}).map(user => { return user.firstName +" "+ user.lastName}),
      call: null
    })
    db.collection("users").doc(activeFriend).collection("messages").doc(currentUser.uid).set({
      message: message,
      timestamp: timestamp,
      fromId: fromId,
      toId: toId, 
      id: autoId, 
      fromName: users.filter(user => {return user.id === currentUser.uid}).map(user => { return user.firstName +" "+ user.lastName}),
      saw: saw,
      call: null
    })



    if(file) {
      sdb
      .ref("message-files")
      .child(currentUser.uid + "/" + activeFriend + "/" + "files/" + autoId + "/" + messageInput)
      .put(fil);
    } 

    if(fileImg) {
     sdb
     .ref("message-files")
     .child(currentUser.uid + "/" + activeFriend + "/" + "images/" + autoId + "/" + messageInput)
     .put(filImg).then(() => {
       sdb
     .ref("message-files")
     .child(currentUser.uid + "/" + activeFriend + "/" + "images/" + autoId + "/" + messageInput).getDownloadURL().then((url) => {
       rdb.ref('messages/' + currentUser.uid + activeFriend).child(autoId).set({
         message: message,
         timestamp: timestamp,
         fromId: fromId,
         toId: toId, 
         id: autoId,
         file:false,
         img: true,
         imgUrl: url
       });
       rdb.ref('messages/' + activeFriend + currentUser.uid).child(autoId).set({
         message: message,
         timestamp: timestamp,
         fromId: fromId,
         toId: toId, 
         id: autoId,
         file:false,
         img: true,
         imgUrl: url
       });
     })
     })
    }
           
           
    if(chatOptions==="no"){
      db.collection("users").doc(currentUser.uid).collection("messages").doc(activeFriend).set({
        message: message,
        timestamp: timestamp,
        fromId: fromId,
        toId: toId, 
        id: autoId, 
        fromName: users.filter(user => {return user.id === activeFriend}).map(user => { return user.firstName +" "+ user.lastName}),
        call: null
      })
      db.collection("users").doc(activeFriend).collection("messages").doc(currentUser.uid).set({
        message: message,
        timestamp: timestamp,
        fromId: fromId,
        toId: toId, 
        id: autoId, 
        fromName: users.filter(user => {return user.id === currentUser.uid}).map(user => { return user.firstName +" "+ user.lastName}),
        saw: saw,
        call: null
     })
    }else {
        db.collection("users").doc(currentUser.uid).collection("messages").doc(activeFriend).set({
          message: message,
          timestamp: timestamp,
          fromId: fromId,
          toId: toId, 
          id: autoId, 
          fromName: {0:chatOptions.chatName},
          call: null
        })
        db.collection("users").doc(activeFriend).collection("messages").doc(currentUser.uid).set({
          message: message,
          timestamp: timestamp,
          fromId: fromId,
          toId: toId, 
          id: autoId, 
          fromName:  {0:chatUserOptions.chatName},
          saw: saw,
          call: null
       })
    }
           
    /* Send and null all input file hanlders */
    setFile(null)
    setFil(null)
    setFileImg(null)
    setFilImg(null)
          
    /* Chat Options */
    if(chatOptions==="no" && chatUserOptions==="no"){
      rdb.ref('messages/' + currentUser.uid + activeFriend).child("options").set({
        chatName: chatUser[0].firstName + " " + chatUser[0].lastName,
        chatTheme: "#625AC0",
        createdTime: new Date().valueOf()
       })
      rdb.ref('messages/' + activeFriend + currentUser.uid).child("options").set({
          chatName: currentUserInfo[0].firstName + " " + currentUserInfo[0].lastName,
          chatTheme: "#625AC0",
          createdTime: new Date().valueOf()
      }) 
    }else if(chatOptions!=="no"){
      rdb.ref('messages/' + currentUser.uid + activeFriend).child("options").update({
        chatName: chatOptions.chatName,
        chatTheme: chatOptions.chatTheme
       })
      rdb.ref('messages/' + activeFriend + currentUser.uid).child("options").update({
          chatTheme: chatOptions.chatTheme,
          chatName: chatUserOptions.chatName,                 
      }) 
    }else if(chatOptions==="no" && chatUserOptions!=="no"){
      rdb.ref('messages/' + currentUser.uid + activeFriend).child("options").set({
        chatName: chatUser[0].firstName + " " + chatUser[0].lastName,
        chatTheme: chatUserOptions.chatTheme,
        createdTime: chatUserOptions.createdTime
       })
      rdb.ref('messages/' + activeFriend + currentUser.uid).child("options").update({
          chatTheme: chatUserOptions.chatTheme,
          chatName: chatUserOptions.chatName
      }) 
    }        

  }
    
  /* On Send */
  const onSend = () => {
      try{
          if(messageInput.length > 0) {
            sendMessage(currentUser.uid, activeFriend, messageInput , new Date().valueOf(), false)
            setMessageInput("")
            setOpenEmojis(false)
          
          const message_ele = document.querySelector("#message:nth-last-child(1)")
          const message_ele_img = document.querySelector("#message-img:nth-last-child(1)")
          if(message_ele) {
            setTimeout(() => {
              message_ele.scrollIntoView();
            }, 10)
          }
          if(message_ele_img) {
            setTimeout(() => {
              message_ele_img.scrollIntoView();
            }, 10)
          }
        }
         
      }catch(err) {
          
      }
  }

  /* Get Friends */
  const getFriends = () => {
      db.collection("users").doc(currentUser.uid).collection("messages").orderBy("timestamp").onSnapshot(function(querySnapshot) {
        setFriends(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            fromId: doc.data().fromId,
            toId: doc.data().toId,
            message: doc.data().message,
            timestamp: doc.data().timestamp,    
            fromName: doc.data().fromName[0], 
            saw: doc.data().saw,
            mId: doc.data().id
          }))
        )
      });
  }

  
  


  /* Use Effects */ 

  /* get chat user by change active friend id */ 
  useEffect(() => {
    getChatUser()
  }, [activeFriend])
  
  /* get all users in db */
  useEffect(() => {
    getUsers()
  }, [])

  /* Online - Offline */
  useEffect(() => {
    // Assuming user is logged in
    rdb.ref("call/" + currentUser.uid).remove()
    const reference = rdb.ref(`/online/${currentUser.uid}`);
    // Set the /users/:userId value to true
    reference.set(true).then(() => console.log('Online presence set'));
    reference
    .onDisconnect()
    .remove()
    .then(() => console.log('On disconnect function configured.'));
  }, [])

  /* Online users read by rdb*/
  useEffect(() => {
    rdb.ref('online/').on('value', (snapshot) => {
      if (snapshot.exists()) {
          setOnlineUsers(snapshot.val())
        } else {
          setOnlineUsers("")
        }
  }) 
  }, [activeFriend])

  /* Get Chat Options */ 
  useEffect(() => {
    getChatOptions()
  }, [clickActiveFriend])

  useEffect(() => {
    getChatUserOptions()
  }, [clickActiveFriend])

  /* Get Messages */
  useEffect(() => {
    getMessages()
  }, [activeFriend])

  /* On Send friend  */
  useEffect(() => {
    friends.filter((f) => {
       return f.id === activeFriend
     }).map((f) => {
       if(!f.saw) {
        db.collection("users").doc(currentUser.uid).collection("messages").doc(activeFriend).update({
          saw: true
         })
       }
     })

}, [onSend])


const [alMes, setAlMes] = useState([])

useEffect(() => {
  rdb.ref('messages/').on('value', (snapshot) => {
    if (snapshot.exists()) {
      setAlMes(snapshot.val())
    } else {
      setAlMes("no")
    }
}) 
}, [])

    return (
        <div className="dashboard-component" >
            <TopBar active={"main-dashboard"} />
            <div className="dashboard-component-container" >
               <div className="dashboard-component-wrapper" >
                <LeftBar 
                    findFriend={findFriend}
                    friends={friends} 
                    onlineUsers={onlineUsers}
                    getFriends={getFriends} 
                    users={users}
                    activeFriend={activeFriend} 
                    clickActiveFriend={clickActiveFriend} 
                    newFriendLoading={newFriendLoading}
                    changeFindFriend={changeFindFriend}    
                    alMes={alMes}                  
           />
                <CenterBar 
                    onSend={onSend} 
                    onlineUsers={onlineUsers}
                    messages={messages} 
                    currentUserInfo={currentUserInfo} 
                    openChat={openChat} 
                    activeFriend={activeFriend}               
                    messageInput={messageInput}
                    changeMessageInput={changeMessageInput}
                    handlerChangeInputImg={handlerChangeInputImg}
                    handlerChangeInput={handlerChangeInput}
                    onEmojiClick={onEmojiClick}
                    handleOpenEmojis={handleOpenEmojis} 
                    openEmojis={openEmojis}
                    clickActiveFriend={clickActiveFriend}
                    chatOptions={chatOptions}
                    chatUserOptions={chatUserOptions}
                    setOpenChat={setOpenChat}             
                    setActiveFriend={setActiveFriend}
                    />
               </div>
            </div>
        </div>
    )
}

export default Dashboard
