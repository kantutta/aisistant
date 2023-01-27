import React, {useContext, useState, useEffect} from "react"
import { auth, db, sdb } from "../firebase_config";
import app from "../firebase_config"

import profilePictureDefault from "../assets/pro-test.png"
import Loading from "../components/All/Loading/Loading";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

 

  function signup(email, password, firstName, lastName) {
    return auth.createUserWithEmailAndPassword(email, password).then((user) => {
      var currentUser = app.auth().currentUser;
      // currentUser.sendEmailVerification()

      var timestamp = new Date().valueOf()
      var date = new Date(timestamp);
      console.log(date.getTime())
      console.log(date)

      db.collection("users").doc(currentUser.uid).set({
       firstName: firstName,
       lastName: lastName,
       email: email,
       userId: currentUser.uid,
       firstLogin: date.getTime()
    })




      }).catch((error) => {
          //ERororror
      });
  }

  function login(email, password){
    return auth.signInWithEmailAndPassword(email, password)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }


  function updateDisplayName(name) {
    return currentUser.updateProfile({
         displayName: name
      })
  }


  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }  

  useEffect(() => {
   const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })


    return unsubscribe

  }, [])

  


  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    updatePassword,
    updateDisplayName, 
  }

  return(
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

