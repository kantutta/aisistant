import React from 'react'
import "./EndForm.css"
import {Link} from "react-router-dom"
const EndForm = ({end_name_btn, end_question, btn_click}) => {

    


    return (
        <div className="form-flex-column-center" >
            <button className="btn-form" onClick={btn_click} type="submit"  >{end_name_btn}</button>
            {end_question === "sign-in" && <p className="have-account" >Do you have an account ? <span className="form-link" ><Link to="/" >Sign In</Link></span></p>}
            {end_question === "sign-up" && <p className="have-account" >Don't have any account ? <span className="form-link" ><Link to="/sign_up" >Sign Up</Link></span></p>}   
            {end_question === "sign-up" && <p className="have-account" >Do you forgot password ? <span><Link to="/forgot_password" >Forgot Password</Link></span></p>}   
            <p className="form-rights" >© Messenger by Fistrba 2021. All rights reserved.</p>       
        </div>
    )
}

export default EndForm
