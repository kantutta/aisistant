import React from 'react'
import "./SignUp.css"
import AuthComponent from '../../components/Auth/AuthComponent';

const SignUp = () => {
    return (
        <div id="sign-up" >
            <AuthComponent type={"signup"} />
        </div>
    )
}

export default SignUp
