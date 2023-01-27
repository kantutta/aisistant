import React from 'react'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './PrivateRoute';
import Dashboard from './pages/Dashboard/Dashboard';
import ProfileSettings from './pages/ProfileSettings/ProfileSettings';


const App = () => {

 

  return (
    <>
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/" component={Dashboard}  />
          <PrivateRoute path="/settings" component={ProfileSettings}  />
          <Route  path="/sign_up" component={SignUp} />
          <Route  path="/login" component={Login} />
          <Route  path="/forgot_password" component={ForgotPassword} />
        </Switch>
      </AuthProvider>
      </Router>
    </>
  )
}

export default App
