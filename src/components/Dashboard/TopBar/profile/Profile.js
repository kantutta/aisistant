import React, {useState, useEffect} from 'react'
import "./Profile.css"
import {useAuth} from "../../../../context/AuthContext"
import {useUsers} from "../../../../context/UsersContext"
import {rdb} from "../../../../firebase_config"
import img from "../../../../assets/pro-test.png"
import { ArrowRight, KeyboardArrowDown } from '@material-ui/icons';
import {useHistory} from "react-router-dom"



const Profile = (props) => {

    const { currentUserInfo } = useUsers()
    const {logout, currentUser} = useAuth()
    const [isOpenProfileMenu, setIsOpenProfileMenu] = useState(false)
    const history = useHistory();


    const [onlineUsers, setOnlineUsers] = useState([])

    useEffect(() => {
      rdb.ref('online/').on('value', (snapshot) => {
        if (snapshot.exists()) {
            setOnlineUsers(snapshot.val())
          } else {
            setOnlineUsers("")
          }
    }) 
    }, [])


    const logout_profile = async() => {
        try{    
            const reference = rdb.ref(`/online/${currentUser.uid}`);
            reference
            .remove().then(() => {
                logout()
                history.push("/login")
            })
        }catch(err) {
            console.log(err)
        }
    }

    const handleChangeLink = () => {
      if(props.active === "main-dashboard") {
         history.push("/settings")
      }  
      if(props.active === "profile-settings") {
         history.push("/")
      }  
    }


    return (
        <div id="profile" >
        <div className="profile" onClick={() => {setIsOpenProfileMenu(!isOpenProfileMenu)}} >
            <KeyboardArrowDown className={isOpenProfileMenu ? "rotate-animation" : ""} />
            <img alt="" src={currentUserInfo[0].profilePic || img} />
        </div>
       {isOpenProfileMenu && <div className={"click-profile"} >
            <div className="my-profile" >
                <img alt="" src={ currentUserInfo[0].profilePic || img} />
                <div>
                    <h3>{currentUserInfo[0].firstName} {currentUserInfo[0].lastName}</h3>
                    <p>{onlineUsers[currentUser.uid] === true ? "Online" : "Offline"}</p>
                </div>
            </div>
            <div className="my-settings profile-options" >
                {
                    props.active === "main-dashboard" && 
                    <div className="change-link" onClick={handleChangeLink} >
                        <div>
                            <span className="material-icons">settings</span>
                            <h4>Settings</h4>
                        </div>
                        <ArrowRight /> 
                    </div>
                }
                {
                    props.active === "profile-settings" && 
                    <div className="change-link" onClick={handleChangeLink}  >
                        <div>
                            <span className="material-icons">home</span>
                            <h4>Home</h4>
                        </div>
                        <ArrowRight /> 
                    </div>
                }
            </div>
            <div className="my-logout profile-options" onClick={logout_profile}  >
                <div>
                    <span className="material-icons">logout</span>
                    <h4>Logout</h4>
                </div>
                <ArrowRight />
            </div>
           <p className="profile-reserved" >Master Chat @ 2021</p>
        </div>}
        </div>
    )
}

export default Profile
