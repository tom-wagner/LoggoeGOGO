import React from 'react';
import axios from 'axios';
import moment from 'moment';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      comments: []
    }
    this.getComments = this.getComments.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onChangeVideo = this.onChangeVideo.bind(this);
    this.getTimeStamp = this.getTimeStamp.bind(this);
  }

  componentDidMount() {
    this.getComments();
  }

  handleChange(comment) {
    this.setState({comment:comment});
  }

  getComments() {
    axios.get('/owner/comment', {
      params: {
        videoId: this.props.videoId
      }
    })
    .then(({data}) => {
      this.setState({
        comments: data
      })
    })
    .catch((err) => {
      console.log(err);
    })
  }

  onChangeVideo(time) {
    this.props.changeVideo(time)
  }

  getTimeStamp(start) {
    var time;
    if (start.length === 5) {
      time = moment(start, 'mm:ss').diff(moment().startOf('day'), 'seconds');
    } else {
      time = moment(start, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
    }
    this.onChangeVideo(time);
  }


  render() {
    return(
      <div style={{width: '300px', padding: '20px'}}>
        <div style={{float: 'left', marginBottom: '20px', fontWeight: '800'}}>Teacher Comments:</div>
        {this.state.comments.length === 0 ? null : this.state.comments.map((comment) => {
          return(
          <div style={{clear: 'both'}}>
            <div className="studentTime" style={timeStyle} onClick={()=>{this.getTimeStamp(comment.begRange)}}> {comment.begRange} - {comment.endRange} </div>
            <div>{comment.comment}</div>
          </div>
          )
        })}
      </div>
    )
  }
}

const timeStyle = {
  float: 'left',
  fontWeight: '800',
  marginBottom: '10px',
}

export default Comments;