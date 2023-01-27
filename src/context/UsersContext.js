import React, {useState, useContext, useEffect} from 'react'
import Loading from '../components/All/Loading/Loading';
import {db} from "../firebase_config"
import {useAuth} from "./AuthContext"

const UsersContext = React.createContext();


export function useUsers() {
    return useContext(UsersContext)
}

export function UsersProvider({ children }) {

    const {currentUser} = useAuth()
    const [currentUserInfo, setCurrentUserInfo] = useState()
    const [loading, setLoading] = useState(true);
  
    const  getUsers = () => {
      db.collection("users").onSnapshot(function(querySnapshot) {
        setCurrentUserInfo(
          querySnapshot.docs.map((doc) => ({
            id: doc.id,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            email: doc.data().email,
            profilePic: doc.data().profilePic
          })).filter((user) => {
            return user.id === currentUser.uid
          })
        )
      });
    }



    useEffect(() => {
      getUsers()
      setTimeout(() => {
       setLoading(false)
      }, 2000)
    }, [])
  
    
  
  
    const value = {
      currentUserInfo
    }
  
    return(
      <UsersContext.Provider value={value}>
        {!loading && children}
        {loading && <Loading />}
      </UsersContext.Provider>
    )
}
  
