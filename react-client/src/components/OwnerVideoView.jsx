import {withRouter, Redirect} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

import OwnerVideoPlayer from './owner-video-view/OwnerVideoPlayer.jsx';
import OwnerTimeStamps from './owner-video-view/OwnerTimeStamps.jsx';
import TeacherUploads from './owner-video-view/TeacherUploads.jsx';
import CommentSlider from './owner-video-view/CommentSlider.jsx';
import Analytics from './owner-video-view/Analytics.jsx';
import Paper from 'material-ui/Paper';
import Visualization from './owner-video-view/Visualization.jsx';
import Auth from '../utils/auth.js';


class OwnerVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeStamps: [],
      comments: [],
      startingTimestamp: 0,
      showCommentForm: false
    };
    this.saveComment = this.saveComment.bind(this);
    this.getComments = this.getComments.bind(this);
    this.changeVideo = this.changeVideo.bind(this);
    this.toggleCommentForm = this.toggleCommentForm.bind(this);
  }

  componentDidMount() {
    this.showTimestamps();
    this.getComments();
  }

  showTimestamps() {
    axios
      .get("/timestamps/owner", {
        params: { videoId: this.props.location.video.videoId }
      })
      .then(data => {
        const timeStamps = data.data.sort((a, b) => a.timestamp - b.timestamp);
        this.setState({ timeStamps: timeStamps });
      });
  }

  saveComment(start, end, comment, callback) {
    axios
      .post("/owner/comment", {
        userId: Auth.userId,
        videoId: this.props.location.video.videoId,
        start: start,
        end: end,
        comment: comment
      })
      .then(({ data }) => {
        callback();
        this.getComments();
      })
      .catch(err => {
        console.log(err);
      });
  }

  getComments() {
    axios
      .get("/owner/comment", {
        params: {
          videoId: this.props.location.video.videoId
        }
      })
      .then(({ data }) => {
        this.setState({
          comments: data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  changeVideo(timestamp) {
    this.setState({ startingTimestamp: timestamp });
  }

  toggleCommentForm() {
    this.setState({
      showCommentForm: !this.state.showCommentForm
    });
  }

  render() {
    if (!this.props.location.video || !this.props.location.video.videoId) {
      return (
        <Redirect
          to={{ pathname: "/owner", state: { from: this.props.location } }}
        />
      );
    }
    return (
      <div>
        <Paper style={style} zDepth={1}>
          <div style={{ display: "inline-block" }}>
            <div style={style2}>
              <Paper style={{ padding: "20px", width: "auto" }}>
                <div>
                  {!!this.props.location.video && (
                    <OwnerVideoPlayer
                      showCommentForm={this.state.showCommentForm}
                      toggleCommentForm={this.toggleCommentForm}
                      startingTimestamp={this.state.startingTimestamp}
                      saveComment={this.saveComment}
                      getComments={this.getComments}
                      video={this.props.location.video}
                      videoId={this.props.location.video.videoId}
                      comments={this.state.comments}
                    />
                  )}
                </div>
              </Paper>
              <br />
              <Paper>
                {this.state.showCommentForm ? (
                  <CommentSlider
                    changeVideo={this.changeVideo}
                    video={this.props.location.video}
                    save={this.saveComment}
                  />
                ) : null}
              </Paper>
              <br />
              <Paper>
                <TeacherUploads
                  username={this.props.location.username}
                  videoId={this.props.location.video.videoId}
                />
              </Paper>
              <br />
              {/* <Paper style={{padding: '20px'}}>
                <div>
                  {this.state.timeStamps.length !== 0 && <Analytics timeStamps={this.state.timeStamps} video={this.props.location.video}/>}
                </div>
              </Paper>
               */}
            </div>
            <Paper style={style3}>
              <div>
                {this.state.timeStamps.length !== 0 && (
                  <OwnerTimeStamps timeStamps={this.state.timeStamps} />
                )}
              </div>
            </Paper>
          </div>
        </Paper>
        <Paper style={{ padding: "20px" }}>
          <div>
            <Visualization videoId={this.props.location.video.videoId} />
          </div>
        </Paper>
      </div>
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
  background: '#D8E4EA'
}

const style2 = {
  width: 'auto', 
  float: 'left', 
  margin: '20px',
}

const style3 = {
  width: '30%', 
  float: 'left', 
  textAlign: 'left', 
  margin: '20px',
  padding: '20px',
}

export default withRouter(OwnerVideo);