import React, {useState} from 'react'
import BeautyContent from './BeautyContent/BeautyContent'
import Form from "./FormContent/Form"
import { useAuth } from '../../context/AuthContext'
import { useHistory } from "react-router-dom"
import { auth } from "../../firebase_config";

const AuthComponent = ({type}) => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const [error, setError] = useState("")

    const history = useHistory();
    const { signup, login, resetPassword} = useAuth();

    const [emailAnimation, setEmailAnimation] = useState(false)
    const [passwordAnimation, setPasswordAnimation] = useState(false)

    const changeTargets = {
        firstName: function(e) {
            setFirstName(e.target.value)
        }, 
        lastName: function(e) {
            setLastName(e.target.value)
        },
        email: function(e) {
            setEmail(e.target.value)
        },
        password: function(e) {
            setPassword(e.target.value)
        },
        passwordConfirm: function(e) {
            setPasswordConfirm(e.target.value)
        }
    }
    
    const errorSet = (err) => {
        setError(err)
        setTimeout(() => {
            setError("")
        }, 2000)
    }
    
    const btn_click_login = async(e) => {
        e.preventDefault()
        if(email && password) {
            try {
                errorSet("")
                await login(email, password);
                history.push("/");
            } catch(err) {
                if(err.code === 'auth/wrong-password'){
                    errorSet("Wrong password")
                    setPasswordAnimation(true)
                    setTimeout(() => {
                        setPasswordAnimation(false)
                    }, 1500)
                }
                if(err.code === 'auth/user-not-found'){
                    errorSet("User not found")
                    setEmailAnimation(true)
                    setTimeout(() => {
                        setEmailAnimation(false)
                    }, 1500)
                }
                if(err.code === "auth/too-many-requests") {
                    errorSet("Too many login attempts, try later again")
                    setEmailAnimation(true)
                    setPasswordAnimation(true)
                    setTimeout(() => {
                        setEmailAnimation(false)
                        setPasswordAnimation(false)
                    }, 1500)
                    setEmail("")
                    setPassword("")
                }
                if(err.code === "auth/invalid-email") {
                    errorSet("Invalid email, please enter a valid email")
                    setEmailAnimation(true)
                    setTimeout(() => {
                        setEmailAnimation(false)
                    }, 1500)
                }
            }finally {
                
            } 
        } else {
            errorSet("Fill all the fields in the form")
        }
    }
    
    let email_exist;
 
     const btn_click_create = (e) => {
         e.preventDefault()
 
         auth.fetchSignInMethodsForEmail(email)
         .then((signInMethods) => {
             if (signInMethods.length) {
             email_exist = true
             setEmailAnimation(true)
             setTimeout(() => {
                 setEmailAnimation(false)
             }, 1500)
             errorSet("Email alredy exist")
             } else {
             email_exist = false
             }
         })
       setTimeout(async() => {
           if(firstName.length > 2 && lastName.length > 2 && email.length > 5 && !email_exist) {
               if(password !== passwordConfirm) {
                 errorSet("The password confirmation does not match.")
                 setPasswordAnimation(true)
                 setTimeout(() => {
                     setPasswordAnimation(false)
                 }, 1500)
               } else {
                   try {
                       setError("")
                       await signup(email, password, firstName, lastName);
                   } catch(err) {
                           setError(err)
                   }finally {
                       history.push("/");
                   }
               }
           } else {
             // errorSet("Fill all the fields in the form")
           }
       }, 1000)
     }


     const btn_click_forgot = async(e) => {
        e.preventDefault();
   
        try {
            await resetPassword(email)
            setError("Check your inbox for further instructions")
            setEmail("")
        } catch {
          setError("Failed to reset password")
        }
    
        setTimeout(() => {
            setError("")
        }, 2000)
     }


    return (
        <div id="auth-component" >
            <BeautyContent />
            {type==="login" && 
            <Form 
              start_name_title ="Sign In To Account"
              firstlast={false}
              emailInput={true}
              passwordInput={true}
              email={email}
              emailAnimation={emailAnimation}
              passwordAnimation={passwordAnimation}
              changeTargets={changeTargets}
              password={password}
              password_confirm={false} 
              end_name_btn={"Login"}
              end_question={"sign-up"}      
              btn_click={btn_click_login}
              error_form={error}
            />}
            {type==="signup" &&
             <Form 
             start_name_title ="Sign Up To Account"
             firstlast={true}
             emailInput={true}
             passwordInput={true}
             password_confirm={true} 
             emailAnimation={emailAnimation}
             passwordAnimation={passwordAnimation}
             end_name_btn={"Create Account"}
             end_question={"sign-in"} 
             firstName={firstName}   
             lastName={lastName}
             email={email}
             password={password}
             passwordConfirm={passwordConfirm}
             changeTargets={changeTargets}
             btn_click={btn_click_create}
             error_form={error}
           />
            }

            {type==="forgot" && 
                <Form 
                start_name_title ="Forgot Password"
                firstlast={false}
                emailInput={true}
                password={false}
                email={email}
                changeTargets={changeTargets}
                btn_click={btn_click_forgot}
                password_confirm={false} 
                end_name_btn={"Send Email"}
                end_question={"sign-in"}      
                error_form={error}
                />
            }

        </div>
    )
}

export default AuthComponent
