import React from 'react';
import axios from 'axios';

import RaisedButton from 'material-ui/RaisedButton';
import YouTube from 'react-youtube';
import Paper from 'material-ui/Paper';
import TeacherComments from './TeacherComments.jsx';
import CommentSlider from './CommentSlider.jsx';
import Auth from '../../utils/auth.js';


class OwnerVideoPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      videoId: this.props.videoId,
      video: this.props.video,
      player: null
    };

    this.onReady = this.onReady.bind(this);
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  onReady(event) {
    this.setState({
      player: event.target,
    });
  }
  
  onPlayVideo() {
    this.state.player.playVideo();
  }

  onPauseVideo() {
    this.state.player.pauseVideo();
  }


  deleteComment(comment) {
    axios.delete('/owner/comment', {params: {comment: comment}})
    .then(() => {
      console.log('Successfully deleted comment');
      this.props.getComments();
    })
    .catch((err) => {
      console.log(err);
    })
  }
  
  render() {
    const opts = {
      height: '390',
      width: '500',
      playerVars: {
        autoplay: 1,
        start: this.props.startingTimestamp,
      }
    };

    return (
      <div>
        <div>
          <YouTube
            videoId={this.state.videoId}
            opts={opts}
            onReady={this.onReady}
          />
        </div>
        <div>
          <RaisedButton 
            style={{margin: '5px'}} 
            onClick={this.onPlayVideo}  
            label="Play"/>
          <RaisedButton 
            style={{margin: '5px'}} 
            onClick={this.onPauseVideo} 
            label="Pause"/>
          <RaisedButton 
            style={{margin: '5px'}} 
            label={this.props.showCommentForm ? 'Hide Form' : 'Add Comment'}
            onClick={this.props.toggleCommentForm}
            />
        </div>
        <br/>
        <Paper>
          <TeacherComments comments={this.props.comments} deleteComment={this.deleteComment}/>
        </Paper>
      </div>
    );
  }
}


export default OwnerVideoPlayer;