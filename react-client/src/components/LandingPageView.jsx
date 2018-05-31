import {withRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';

import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

import Auth from '../utils/auth.js';

class LandingPage extends React.Component {
  constructor() {
    super();

    this.state = {
      username: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.sendTo = this.sendTo.bind(this);
  }

  handleChange(input) {
    this.setState({ username: input });
  }

  handleLogin() {
    axios
      .post('/login', { username: this.state.username })
      .then((response) => {
        const isAuthenticated = !!response.data.length;

        if (isAuthenticated) {
          const isOwner = response.data[0].owner;
          const username = response.data[0].name;

          Auth.getInfo()
            .then(res => {
              (isOwner) ? 
              this.sendTo('/owner', username) : 
              this.sendTo('/student', username);
            })
        } else {
          this.refs['autocomplete'].setState({searchText:''});
          window.alert('Username does not exist');
        }
      })
      .catch((err) => console.log('ERROR: ', err))
  }

  sendTo(path, username = '') {
    this.props.history.push({
      pathname: path,
      username: username,
    });
  }

  render () {
    return (
      <Paper style={paperStyle} zDepth={1}>

          <h3> Team Loggoe GoGo App </h3>

          <AutoComplete 
            dataSource={[]} 
            hintText="Username"
            ref={'autocomplete'}
            onUpdateInput={this.handleChange}
            onNewRequest={this.handleLogin}
            />

          <Paper>
            <FlatButton 
              style={buttonStyle} 
              label='Login' 
              onClick={this.handleLogin}
              />
          </Paper>

          <Paper>
            <FlatButton 
              style={buttonStyle} 
              label='Register' 
              onClick={() => {this.sendTo('/registration')}}
              />
          </Paper>

      </Paper>
    );
  }

}

const paperStyle = {
  height: 'auto',
  width: 'auto',
  padding: 10,
  textAlign: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'inline-block',
};

const buttonStyle = {
  height: 'auto',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
};

export default withRouter(LandingPage);