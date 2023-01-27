import React from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import "./InputForm.css"


const InputForm = ({input_name, input_icon, input_type, input_visi, changePS, password_visibility, input_value,changeTarget, emailAnimation, passwordAnimation }) => {
    return (
        <div className="input" >
           {input_icon === "person" && <AccountCircleIcon className="" />}
           {input_icon === "email" && <EmailIcon className={emailAnimation ? "icon_ani" : " "} />}
           {input_icon === "lock" && <LockIcon className={passwordAnimation ? "icon_ani" : " "} />}
           <input placeholder={input_name} type={input_type} onChange={changeTarget} value={input_value} required /> 
           {password_visibility ?  input_visi === "visi" && <VisibilityIcon className="visibility-password" onClick={changePS} /> : input_visi === "visi" && <VisibilityOffIcon className="visibility-password" onClick={changePS} />}
           {password_visibility ?  input_visi === "visi_con" && <VisibilityIcon className="visibility-password" onClick={changePS} /> : input_visi === "visi_con" && <VisibilityOffIcon className="visibility-password" onClick={changePS} />}
        </div>
    )
}

export default InputForm
