import {BrowserRouter as Router, Route, Link, Switch, History} from 'react-router-dom';
import ReactDOM from 'react-dom';
import React from 'react';
import $ from 'jquery';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import axios from 'axios';
import Visualization from './components/owner-video-view/Visualization.jsx';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PrivateRoute from './components/router/PrivateRoute.jsx';
import LandingPage from './components/LandingPageView.jsx';
import RegistrationPage from './components/RegistrationPageView.jsx';
import StudentHomepage from './components/StudentHomepageView.jsx';
import StudentVideo from './components/StudentVideoView.jsx';
import OwnerHomepage from './components/OwnerHomepageView.jsx';
import OwnerVideo from './components/OwnerVideoView.jsx';
import OwnerBuildSeries from './components/OwnerBuildSeriesView.jsx';
import NavBar from './components/NavBar.jsx';

import Auth from './utils/auth.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfoLoaded: false
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    Auth
      .getInfo()
      .then(res => {
        this.setState({
          userInfoLoaded: true
        })
      });
  }

  handleLogout() {
    axios
      .post('/logout')
      .then(res => {
        this.setState({ isLoggedIn: false }, () => {
          window.location.reload()
        });
      })
  }

  render () {
    if (!this.state.userInfoLoaded) {
      return <div>Loading...</div>;
    }
    return (
      <MuiThemeProvider>
        <Router>
          <div>
            <Route exact={true} path='/' component={() => {
              return <NavBar exact={true} path={'/'} 
                                          isLoggedIn={Auth.isLoggedIn}/>
            }}/>

            <Route path='/registration' component={({...rest}) => {
              return <NavBar {...rest} path={'/registration'} 
                                        isLoggedIn={Auth.isLoggedIn}/>          
            }}/>

            <PrivateRoute exact={true} path='/student' component={({...rest}) => {
              return <NavBar {...rest} path={'/student'}
                                        handleLogout={this.handleLogout} 
                                        isLoggedIn={Auth.isLoggedIn}/>          
            }}/>

            <PrivateRoute path='/student/video' component={({...rest}) => {
              return <NavBar {...rest} path={'/student/video'}
                                        handleLogout={this.handleLogout} 
                                        studentRedirect={true}
                                        isLoggedIn={Auth.isLoggedIn}/>          
            }}/>

            <PrivateRoute exact={true} path='/owner' component={({...rest}) => {
              return <NavBar {...rest} path={'/owner'}
                                        buildRedirect={true} 
                                        handleLogout={this.handleLogout}
                                        isLoggedIn={Auth.isLoggedIn}/>          
            }}/>

            <PrivateRoute path='/owner/video' component={({...rest}) => {
              return <NavBar {...rest} path={'/owner/video'}
                                        ownerRedirect={true}
                                        handleLogout={this.handleLogout}
                                        isLoggedIn={Auth.isLoggedIn}/>          
            }}/>

            <PrivateRoute path='/owner/build' component={({...rest}) => {
              return <NavBar {...rest} path={'/owner/build'}
                                        ownerRedirect={true}
                                        handleLogout={this.handleLogout}
                                        isLoggedIn={Auth.isLoggedIn}/>          
            }}/>
          
            <Route exact={true} path='/' component={(props) => <LandingPage/> }/>
            <Route path='/registration' component={(props) => <RegistrationPage /> }/>
            <Route exact={true} path='/student' component={({...rest}) => <StudentHomepage {...rest}/> }/>
            <Route path='/student/video' component={({...rest}) => <StudentVideo {...rest}/> }/>
            <Route exact={true} path='/owner' component={({...rest}) => <OwnerHomepage {...rest}/> }/>
            <Route path='/owner/video' component={({...rest}) => <OwnerVideo {...rest}/> }/>
            <Route path='/owner/build' component={({...rest}) => <OwnerBuildSeries {...rest}/> }/>

          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}

export default DragDropContext(HTML5Backend)(App);