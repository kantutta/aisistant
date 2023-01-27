import React, {useState, useRef} from 'react'
import "./CenterBar.css"
import pro_img from "../../../assets/pro-test.png"
import {useUsers} from "../../../context/UsersContext"
import {db, sdb} from "../../../firebase_config"
import { useAuth } from '../../../context/AuthContext'
import { useHistory } from "react-router-dom"
import firebase from "firebase/app";
import "firebase/auth";
import { ControlPoint } from '@material-ui/icons'
import InputForm from "../../Auth/FormContent/input-form/InputForm"

const Centerbar = () => {

    const [choose, setChoose] = useState("")

    const {currentUserInfo} = useUsers()

    const {currentUser, updateEmail, updatePassword} = useAuth()
    
    const [firstName, setFirstName] = useState(currentUserInfo[0].firstName)
    const [lastName, setLastName] = useState(currentUserInfo[0].lastName)
    const [fileImg, setFileImg] = useState()
    const [filImg, setFilImg] = useState()
    const [emailRef, setEmailRef] = useState(currentUserInfo[0].email)
    const [passwordRef, setPasswordRef] = useState()
    const [passwordConfirmRef, setPasswordConfirmRef] = useState()
    // const passwordRef = useRef();

    const history = useHistory();
    const [password_visibility, setPassword_visibility] = useState(false)
    const [password_visibility_con, setPassword_visibility_con] = useState(false)
    const [ps_type, setPs_type] = useState("password")
    const [ps_type_con, setPs_type_con] = useState("password")
  

    
    const changePS = () => {
      if(!password_visibility) {
        setPs_type("text")
        setPassword_visibility(true)
      } else {
        setPs_type("password")
        setPassword_visibility(false)
      }
    }
    const changePS_con = () => {     
      if(!password_visibility_con) {
        setPs_type_con("text")
        setPassword_visibility_con(true)
      } else {
        setPs_type_con("password")
        setPassword_visibility_con(false)
      }
    }
    let settings_title="Profile Settings"

    /* Choose Settings Title */
    if(choose==="f_n") {
        settings_title="Display Name"
    }else if(choose==="em") {
        settings_title="Email"
    }else if(choose==="ps") {
        settings_title="Password"
    }else if(choose==="pr") {
        settings_title="Profile Picture"
    }

    /* Change Full Name */
    const changeFullName = () => {
        db.collection("users").doc(currentUser.uid).update({
           firstName: firstName,
           lastName: lastName 
        })

        setChoose("")
    }


    /* Change Email */
    const changeEmail = (e) => {
       
        if(emailRef !== currentUserInfo.email) {
            updateEmail(emailRef).then(() => {
                db.collection("users").doc(currentUser.uid).update({
                    email: emailRef
                })
                setChoose("")
            }).catch((err) => {
                alert(err)
            })
        }else {
            alert("Same email !")
        }
        
        
        
        

    }

    /* Change Password */
    const changePassword = () => {
        if(passwordRef === passwordConfirmRef) {
            try {
                updatePassword(passwordRef) 
            }catch(err) {
                alert(err)
            }
            setChoose("")
        }else {
            alert("Password is not confirm")
        }
    }

    /* Open Input File Handler */
    const handlerUploadImg = () => {
        
        const fileSelector = document.querySelector('.file_input_img');
        var clickEvent = new MouseEvent('click', {bubbles: true});
        fileSelector.dispatchEvent(clickEvent);        

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

    }

    /* Update Profile Picture */
    const handleUpdatePicture = () => {
        if(fileImg) {
          sdb
          .ref("users")
          .child(currentUser.uid + "/profile-picture/" + filImg.name)
          .put(filImg).then(() => {
            sdb
          .ref("users")
          .child(currentUser.uid + "/profile-picture/" + filImg.name).getDownloadURL().then((url) => {
             db.collection("users").doc(currentUser.uid).update({
                 profilePic: url
             })
           })
          })
          setChoose("")
        }else {
               alert("Choose new image to upload your profile picture")
        }
        
        setFilImg(null)
        setFileImg(null)

    }

    return (
        <div id="center-bar" >
            <input type="file" className="file_input_img" accept="image/png, image/gif, image/jpeg" onChange={handlerChangeInputImg} />
            <div className="wrapper-center-bar" >
                <div className="wrp-title" >
                    {choose!=="" &&
                     <span class="material-icons" onClick={() => setChoose("")}>arrow_back</span> }
                     <h2 className="setting-title" >{settings_title}</h2>
                </div>

                {choose==="" && 
                 <div className="choose-set" >
                     <div className="box-set" onClick={() => setChoose("pr")} >
                         <div>
                            <h4>Profile Picture</h4>
                          
                        </div>   
                     </div>
                     <div className="box-set" onClick={() => setChoose("f_n")} >
                        <div>
                            <h4>Display Name</h4>
                            
                        </div>
                     </div>
                     <div className="box-set" onClick={() => setChoose("em")} >
                        <div>
                            <h4>Email </h4>
                            
                        </div>
                     </div>
                     <div className="box-set" onClick={() => setChoose("ps")} >
                        <div>
                            <h4>Password </h4>
                           
                        </div>
                     </div>
                 </div>
                }


                {
                choose==="f_n" &&
                <div className="full-name center-setting" >
                    <div className="flex-inputs-set" >
                        <InputForm  input_name="First Name" input_type="text" input_icon="person" input_value={firstName} changeTarget={(e) => setFirstName(e.target.value)}/>
                        <InputForm  input_name="Last Name" input_type="text" input_icon="person" input_value={lastName} changeTarget={(e) => setLastName(e.target.value)}/>
                    </div>
                    <button onClick={changeFullName} className="btn-change" >Change Full Name</button>
                </div>
                }
                {
                choose==="em" &&
                <div className="email center-setting" >
                    <div className="flex-inputs-set" >
                        <InputForm  input_name="Email" input_type="text" input_icon="email" input_value={emailRef} changeTarget={(e) => setEmailRef(e.target.value)} />
                    </div>
                    <button onClick={changeEmail} className="btn-change" >Change Email</button>
                </div>
                }
                {
                choose==="ps" &&
                <div className="password center-setting" >
                    <div className="flex-inputs-set" >
                        <InputForm  input_name="Password" input_type={ps_type} input_icon="lock" input_visi="visi" changePS={changePS} password_visibility={password_visibility} input_value={passwordRef} changeTarget={(e) => {setPasswordRef(e.target.value)}}/>
                        <InputForm  input_name="Password Confrim" input_type={ps_type_con} input_icon="lock" input_visi="visi_con" changePS={changePS_con} password_visibility={password_visibility_con} input_value={passwordConfirmRef} changeTarget={(e) => {setPasswordConfirmRef(e.target.value)}}  />
                    </div>
                    <button onClick={changePassword} className="btn-change" >Change Password</button>
                    </div>
                }
                {
                choose==="pr" &&
                <div className="profile-picture center-setting" >
                    <div className="image-change" >
                        <img onClick={handlerUploadImg} alt="" className="add-picture" title="Click and choose new profile picture" src={fileImg ||currentUserInfo[0].profilePic || pro_img} />
                        <span className="material-icons plus-pr">add</span>
                    </div>
                    <button onClick={handleUpdatePicture}  className="btn-change">Update Picture</button>
                </div>
                }

    
            </div>
        </div>
    )
}

export default Centerbar
