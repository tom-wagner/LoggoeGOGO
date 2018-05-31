import {withRouter} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

import VideoList from './student-homepage-view/VideoListView.jsx';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class StudentHomepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            videoList: [],
            allVideosInDB: [],
            teachers: [],
            selectedTeacher: null,
            seriesList: [],
            selectedSeries: 'All Videos',
        };
        this.sendToSelectedVideo = this.sendToSelectedVideo.bind(this);
        this.getTeachers = this.getTeachers.bind(this);
        this.handleTeacherChange = this.handleTeacherChange.bind(this);
        this.handleSeriesChange = this.handleSeriesChange.bind(this);
        this.getVideosByTeacher = this.getVideosByTeacher.bind(this);
        this.getAllVideos = this.getAllVideos.bind(this);
        this.filterBySeries = this.filterBySeries.bind(this);
    }

    componentDidMount() {
      this.getTeachers();
      this.getAllVideos();
    }

    sendToSelectedVideo(videoId) {
      this.props.history.push({
        pathname: '/student/video',
        videoId: videoId,
        username: this.props.location.username,
      })
    }

    getAllVideos() {
      axios
        .get('/student/homepage')
        .then(({data}) => {

          // iterate through data and pull out all the series names
          let seriesObj = {};
          for (var video of data) {
            if (!seriesObj[video.series]) { // && video.series !== null
              seriesObj[video.series] = true;
            }
          }

          this.setState({
            videoList: data,
            allVideosInDB: data,
            seriesList: Object.keys(seriesObj),
          });
        })
        .catch((err) => {
          console.log(err);
        })
    }

    getTeachers() {
      axios
        .get('/student/teachers')
        .then(({data}) => {
          this.setState({ teachers: data });
        })
        .catch((err) => {
          console.log(err);
        })
    }

    handleTeacherChange(event, index, value) {
      this.setState({
        selectedTeacher: value,
        selectedSeries: 'All Videos',
      }, () => {
        this.getVideosByTeacher();
      })
    }

    handleSeriesChange(event, index, value) {
      this.setState({
        selectedTeacher: null,
        selectedSeries: value,
      }, () => {
        if (this.state.selectedSeries === 'All Videos') {
          this.setState({
            selectedSeries: null,
            videoList: this.state.allVideosInDB,
          });
        } else {
          this.filterBySeries(value.series);
        }

      });

      this.setState({ selectedSeries: value }, () => {
        if (this.state.selectedSeries === 'All Videos') {
          // reset selectedSeries to null so remove -> delete function switching logic works
          this.setState({
            selectedSeries: null,
            videos: this.state.allVideos,
          });
        } else {
          this.filterBySeries(value);
        }
      });
    }

    getVideosByTeacher() {
      axios
        .get('/student/videos', {params: {teacher: this.state.selectedTeacher}})
        .then(({data}) => {
          this.setState({ videoList: data })
        })
        .catch((err) => {
          console.log(err);
        });
    }

    filterBySeries(series) {
      let filteredArr = [];
      let allVideos = [...this.state.allVideosInDB];
  
      for (var item of allVideos) {
        if (item.series === series) {
          filteredArr.push(item);
        }
      }
  
      this.setState({ videoList: filteredArr });
    }

  render() {
    return (
      <Paper style={style} zDepth={1}>
        <h6>You are logged in as {this.props.location.username}</h6>
        <div>
          <br />
          {/* FILTER BY TEACHER */}
          <Paper style={searchStyle} zDepth={1}>
            <DropDownMenu name="selectedTeacher" value={this.state.selectedTeacher} onChange={this.handleTeacherChange} style={{ width: '200px' }}>
              <MenuItem value={100000} primaryText={"Select Teacher"} />
              {this.state.teachers.length === 0 ? null : this.state.teachers.map((teacher) => {
                return (
                  <MenuItem key={teacher.id} value={teacher.id} primaryText={teacher.firstName} />
                );
              })}
            </DropDownMenu>
          </Paper>

          {/* FILTER BY SERIES */}
          <Paper style={searchStyle} zDepth={1}>
            <DropDownMenu name="selectedSeries" value={this.state.selectedSeries} onChange={this.handleSeriesChange} style={{ width: '200px' }}>
              {this.state.seriesList.length === 0 ? null : this.state.seriesList.map((series, idx) => {

                // null is being coerced to 'null' at some point --> hence 'null' check
                if (series === 'null') { series = 'All Videos'; }

                // convert 'All Videos' to 'Select Series' for use within dropdown
                let altMenuItemText = undefined;
                if (series === 'All Videos') { altMenuItemText = 'Select Series'; }
                console.log('alt menu: ', altMenuItemText);

                return (
                  <MenuItem key={idx} value={series} primaryText={altMenuItemText || series} />
                );
              })}
            </DropDownMenu>
          </Paper>


          <Paper style={searchStyle}>
            <RaisedButton onClick={() => { this.getAllVideos() }} label="Back to All Videos" labelStyle={{ textTransform: 'none' }} />
          </Paper>
          <VideoList
            videos={this.state.videoList}
            redirect={this.sendToSelectedVideo} />
        </div>
      </Paper>
    );
  }
}

const style = {
  height: 'auto',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px',
  background: '#D8E4EA',
};

const searchStyle = {
  height: '100%',
  width: 'auto',
  margin: '20px',
  textAlign: 'center',
  display: 'inline-block',
  padding: '10px',
};

export default withRouter(StudentHomepage);