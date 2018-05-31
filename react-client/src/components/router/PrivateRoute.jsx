import React from 'react';
import {BrowserRouter as Router, Route, Redirect, Switch, History} from 'react-router-dom';
import Auth from '../../utils/auth.js';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (Auth.isLoggedIn) {
                props.location.username = Auth.username;
            }
            return Auth.isLoggedIn ? 
            <Component {...props} /> : 
            <Redirect to={{pathname: '/', state: { from: props.location }}}/>}}
    />
  );

export default PrivateRoute;
