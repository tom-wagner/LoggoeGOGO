import {withRouter} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import Paper from 'material-ui/Paper';

import Auth from '../utils/auth.js';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputUsername: '',
      registrationType: 'student',
      isOwner: false,
    };

    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.sendToUserHomepage = this.sendToUserHomepage.bind(this);
    this.switchRegistration = this.switchRegistration.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  handleUpdateInput(input) {
    this.setState({inputUsername: input});
  }

  sendToUserHomepage(user) {
    const path = (this.state.isOwner) ? '/owner' : '/student';
    this.props.history.push({
      pathname: path,
      username: user.username,
    });
  }

  switchRegistration(isOwner) {
    (isOwner) ? 
      this.setState({isOwner: true, registrationType: 'owner'}) : 
      this.setState({isOwner: false, registrationType: 'student'});
  }

  handleRegistration() {
    const user = {
      username: this.state.inputUsername,
      isOwner: this.state.isOwner,
    };

    axios.post('/register', user)
      .then(response => {
        const isExist = response.data;

        if (isExist) {
          this.refs['autocomplete'].setState({ searchText: '' });
          window.alert('Username already exists');
        }
        else {
          this.sendToUserHomepage(user)
        }

      })
      .catch((err) => console.log('error in client side', err))
  }

  render () {
    return (
      <Paper style={paperStyle}>
          <AutoComplete 
            style={inputStyle} 
            dataSource={[]}
            ref={'autocomplete'}
            hintText="New Username"
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.handleRegistration}
          />
          <FlatButton
            style={buttonStyle}
            label={`Register as ${this.state.registrationType}`} 
            onClick={this.handleRegistration}
          />
          <Toggle 
            style={toggleStyle} 
            onToggle={(_, isOwner) => {this.switchRegistration(isOwner)}}
          />
      </Paper>
    );
  }
}

const paperStyle = {
  height: 'auto',
  width: 'auto',
  display: 'inline-block',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const buttonStyle = {
  height: 'auto',
  width: '100%',
  textAlign: 'center',
  display: 'inline-block',
};

const inputStyle = {
  width:'100%',
  margin: 20,
  display: 'inline-block',
  position: 'relative',
  left: '50%',
  transform: 'translate(-28%, 0%)',
};

const toggleStyle = {
  position:'relative', 
  left:'50%', 
  transform: 'translate(-6%, 0%)',
};

export default withRouter(Registration);