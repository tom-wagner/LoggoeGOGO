import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import Auth from '../../utils/auth.js';

class TimestampListEntry extends React.Component {
  constructor(props) {
    super(props)
    
    this.onDeleteTimestamp = this.onDeleteTimestamp.bind(this);
    this.onChangeVideo = this.onChangeVideo.bind(this);
  }

  onChangeVideo() {
    this.props.changeVideo(this.props.timestamp.timestamp);
  }

  onDeleteTimestamp() {
    this.props.deleteTimestamp(this.props.timestamp.id);
  }
  
  render() {
    return (
      <Paper style={style}>
        <div>
          <h4 style={{display: 'inline'}}>User logged in: </h4> 
          {this.props.userId}
        </div>
        <div>
          <h4 style={{display: 'inline'}}>Timestamp: </h4> 
          {(this.props.timestamp.timestamp / 60 | 0) + ':' + String(this.props.timestamp.timestamp % 60).padStart(2, '0')}
        </div>
        <div>
          <h4 style={{display: 'inline'}}>Username: </h4>
          {this.props.timestamp.username}
        </div>
        <div>
          <h4 style={{display: 'inline'}}>User ID: </h4> 
          {this.props.timestamp.userId}
          {/* the above is the same as this.props.userId */}
        </div>
        <div style={{marginBottom: '10px'}}>
          <h4 style={{display: 'inline'}}>Comment: </h4> 
          {this.props.timestamp.comment}
        </div>
        <div>
          <RaisedButton onClick={this.onChangeVideo} style={{padding: '5px'}}>Watch This Clip</RaisedButton>
          {Auth.userId === this.props.timestamp.userId ? 
            <IconButton onClick={this.onDeleteTimestamp} aria-label="Delete">
              <DeleteIcon />
            </IconButton> : null }
        </div>
      </Paper>
      );
  }
}

const style = {
  width: '80%', 
  margin: '10px', 
  padding: '20px', 
  float: 'left',
};

export default TimestampListEntry;