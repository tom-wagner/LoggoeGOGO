import ReactDOM from 'react-dom';
import React from 'react';
import axios from 'axios';
import $ from 'jquery';
import {Redirect} from 'react-router-dom';

import VideoPlayer from './student-video-view/VideoPlayer.jsx'
import VideoUploads from './student-video-view/VideoUploads.jsx'
import TimestampList from './student-video-view/TimestampList.jsx'
import ChatRoom from './student-video-view/ChatRoom.jsx'
import Comments from './student-video-view/Comments.jsx'
import Paper from 'material-ui/Paper';

class StudentVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timestamps: [],
      startingTimestamp: 0,
      userId: ""
    };

    this.getAllTimestamps = this.getAllTimestamps.bind(this);
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
    this.deleteTimestamp = this.deleteTimestamp.bind(this);
    this.changeVideo = this.changeVideo.bind(this);
  }

  componentDidMount() {
    const videoId = this.props.location.videoId;
    this.getUserId(this.props.location.username);
  }

  getUserId(user) {
    axios.get("/user/id", { params: { user: user } }).then(data => {
      this.setState({ userId: data.data[0].id });
      this.getAllTimestamps();
    });
  }

  saveTimeStamp(timestamp, comment) {
    const user = this.state.userId;
    const videoId = this.props.location.videoId;

    axios
      .post("/timestamps", {
        params: {
          userId: user,
          videoId: this.props.location.videoId,
          timestamp: timestamp,
          comment: comment
        }
      })
      .then(() => {
        this.getAllTimestamps();
      });
  }

  deleteTimestamp(id) {
    const user = this.state.userId;
    const videoId = this.props.location.videoId;

    axios
      .delete("/timestamps", {
        params: {
          userId: user,
          videoId: this.props.location.videoId,
          id: id
        }
      })
      .then(() => {
        this.getAllTimestamps();
      })
      .then(this.setState({ startingTimestamp: this.state.timestamps[0] }));
  }

  getAllTimestamps() {
    const videoId = this.props.location.videoId;

    axios
      .get("/timestamps", {
        params: {
          videoId: this.props.location.videoId,
          userId: this.state.userId
        }
      })
      .then(data => data.data.map(TS => TS))
      .then(TS => {
        this.setState({ timestamps: TS });
      });
  }

  changeVideo(timestamp) {
    this.setState({ startingTimestamp: timestamp });
  }

  render() {
    if (!this.props.location.videoId) {
      return <Redirect to={{pathname: '/student', state: { from: this.props.location }}}/>
    }
    return (
      <Paper style={style} zDepth={1}>
        <h6>You are logged in as {this.props.location.username}</h6>
        <div>
          <div>
            <Paper style={paperStyle4}>
              <VideoPlayer
                videoId={this.props.location.videoId}
                startingTimestamp={this.state.startingTimestamp}
                saveTimeStamp={this.saveTimeStamp}
              />
              <br/>
              <Comments
                videoId={this.props.location.videoId}
                saveTimeStamp={this.saveTimeStamp}
                changeVideo={this.changeVideo}
              />
            </Paper>
          </div>
          
          <div>
          </div>
          <div>
            <Paper style={paperStyle2}>
              <ChatRoom
                username={this.props.location.username}
                videoId={this.props.location.videoId}
                userId={this.props.location.userId}
              />
            </Paper>
          </div>
          
          <div>
            <Paper style={paperStyle2}>
              <TimestampList
                timestamps={this.state.timestamps}
                deleteTimestamp={this.deleteTimestamp}
                changeVideo={this.changeVideo}
                userId={this.props.location.userId}
              />
            </Paper>
          </div>
          <div>
            <Paper style={paperStyle1}>
              <VideoUploads 
                videoId={this.props.location.videoId}
              />
            </Paper>
          </div>
        </div>
      </Paper>
    );
  }
}


const style = {
  height: 'auto',
  width: '95%',
  margin: '30px',
  textAlign: 'center',
  display: 'inline-block',
  padding: '30px',
  background: '#D8E4EA',
}

const paperStyle1 = {
  margin: '20px', 
  padding: '20px', 
  width: '60%', 
  float: 'left',
}

const paperStyle2 = {
  margin: '20px', 
  padding: '20px', 
  width: '30%', 
  float: 'left',
}

const paperStyle4 = {
  margin: '20px', 
  padding: '20px', 
  width: 'auto', 
  float: 'left',
}

export default StudentVideo;
