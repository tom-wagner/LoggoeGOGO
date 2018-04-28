import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

class VideoUploads extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploads: []
    };
  }

  componentDidMount() {
    this.getUploads();
  }

  render() {
    return (
      <Paper>
        <div>
          <div>Supplemental Material:</div>
          <ul>
            {this.state.uploads.map((upload) => {
              return (<div><a href={upload.url} target="_blank">{upload.filename}</a> </div>)
            })}
          </ul>
        </div>
      </Paper>
    );
  }

  getUploads() {
    axios
      .get("/teacherUpload", { params: { videoId: this.props.videoId } })
      // .get("/teacherUploads", { params: { videoId: this.props.videoId, username: this.props.username } })
      .then((data) => {
        console.log("successfully getting file uploads from db!", data.data);
        this.setState({
          uploads: [...data.data]
        })
      })
      .catch(err => console.log("ERROR IN GETTING UPLOADS FROM DB", err));
  }
}

export default VideoUploads;