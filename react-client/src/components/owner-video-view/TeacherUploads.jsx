import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import filestack from 'filestack-js';
import config from '../../../../config';
import axios from 'axios';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import Auth from '../../utils/auth.js';

class TeacherUploads extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploads: []
    };

    this.openPicker = this.openPicker.bind(this);
    this.getUploads = this.getUploads.bind(this);
    this.saveUploads = this.saveUploads.bind(this);
    this.removeUpload = this.removeUpload.bind(this);
  }

  componentDidMount() {
    this.getUploads();
  }

  render() {
    return (
      <Paper>
        <div>
          <div id="uploadButton">
            <RaisedButton onClick={this.openPicker} style={{padding: '5px'}}>
              Upload File
              <FileUpload/>
            </RaisedButton>
          </div>
          <ul>
            {this.state.uploads.map((upload) => {
              return (<div><a href={upload.url} target="_blank">{upload.filename}</a> &nbsp;
                          <button value={upload.url} onClick={this.removeUpload}>remove</button></div>)
            })}
          </ul>
        </div>
      </Paper>
    );
  }

  openPicker() {
    var fsClient = filestack.init(config.FILESTACK_API);
    fsClient
      .pick({
        fromSources: [
          "local_file_system",
          "imagesearch",
          "googledrive",
          "dropbox",
          "evernote",
          "github"
        ]
      })
      .then(response => {
        this.saveUploads(response.filesUploaded);
        this.getUploads();
      })
      .catch(err => console.log("ERROR IN FILE UPLOAD", err));
  }


  saveUploads(data) {
    data.forEach((upload) => {
      upload['videoId'] = this.props.videoId;
    });
    
    axios
      .post("/teacherUpload", { data: data})
      .then(() => console.log("successfully saved file upload to db!"))
      .catch(err => console.log("ERROR IN SAVING FILE UPLOAD TO DB", err));
  }

  getUploads() {
    axios
      .get("/teacherUpload", { params: { videoId: this.props.videoId, username: Auth.username } })
      .then((data) => {
        this.setState({uploads: [...data.data]})
      })
      .catch(err => console.log("ERROR IN GETTING UPLOADS FROM DB", err));
  }

  removeUpload(e) {
    this.state.uploads.forEach((upload) => {
      if(upload.url === e.target.value){
        axios.delete('/teacherUpload', { data: { url: upload.url }})
          .then(() => console.log("successfully deleted upload from db!"))
          .catch((err) => console.log("ERROR IN DELETING FILE FROM DB", err));
      }
    });
    this.getUploads();
  }
}

export default TeacherUploads;