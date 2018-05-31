import React from 'react';
import axios from 'axios';

import YouTube from 'react-youtube';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';
import moment from 'moment';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      videoId: this.props.videoId,
      player: null
    };

    this.onReady = this.onReady.bind(this);
    this.onPlayVideo = this.onPlayVideo.bind(this);
    this.onPauseVideo = this.onPauseVideo.bind(this);
    this.saveTimeStamp = this.saveTimeStamp.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onReady(event) {
    this.setState({
      player: event.target,
    });
  }
  
  onPlayVideo() {
    this.state.player.playVideo();
  }

  handleChange(comment) {
    this.setState({comment:comment});
  }

  onPauseVideo() {
    this.state.player.pauseVideo();
  }

  saveTimeStamp() {
    const timestamp = Math.floor(this.state.player.getCurrentTime());
    this.props.saveTimeStamp(timestamp, this.state.comment);
  }

  clearInput(){
    this.setState({
      comment: ''
    });
  }

  render() {
    const opts = {
      height: '390',
      width: '500',
      playerVars: {
        autoplay: 1,
        start: this.props.startingTimestamp,
      },
    }

    return (
      <div style={{ display: "block", margin: "20px" }}>
        <div>
          <YouTube videoId={this.state.videoId} opts={opts} onReady={this.onReady} />
        </div>
        <br />
        <div>
          <div>
            <RaisedButton onClick={this.onPlayVideo} label="Play" style={{ margin: "5px" }} />
            <RaisedButton onClick={this.onPauseVideo} label="Pause" style={{ margin: "5px" }} />
          </div>
          <label>
            <h4 style={{ display: "inline" }}>Comment: </h4>
            <AutoComplete dataSource={[]} 
                          refs={"autocomplete"} 
                          searchText={this.state.comment}
                          onUpdateInput={this.handleChange} 
                          onNewRequest={this.saveTimeStamp} />
            <RaisedButton onClick={() => {
                this.saveTimeStamp();
                this.clearInput();
              }} label="Confused" style={{ margin: "5px" }} />
          </label>
        </div>
      </div>
    );
  }
}

export default VideoPlayer;