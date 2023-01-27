import React from 'react'
import "./Login.css"
import AuthComponent from '../../components/Auth/AuthComponent';

const Login = () => {
    return (
        <div id="login" >
            <AuthComponent type={"login"} />
        </div>
    )
}

export default Login
