import {withRouter} from 'react-router-dom';
import React from 'react';
import axios from 'axios';

import Hidden from './shared-components/Hidden.jsx';
import SearchList from './owner-homepage-view/SearchList.jsx';
import VideoList from './owner-homepage-view/VideoList.jsx';
import Search from './owner-homepage-view/Search.jsx';
import OwnerVideo from './OwnerVideoView.jsx';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

class OwnerHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allVideos: [], // used to retain all videos client-side after filtering by series
      videos: [],
      video: '',
      userId: '',
      searchedVideos: [],
      seriesList: [],
      selectedSeries: 'All Videos',
    }
    this.getUserId = this.getUserId.bind(this);
    this.showVideoList = this.showVideoList.bind(this);
    this.sendToSelectedVideo = this.sendToSelectedVideo.bind(this);
    this.getYouTubeVideos = this.getYouTubeVideos.bind(this);
    this.saveVideo = this.saveVideo.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterBySeries = this.filterBySeries.bind(this);
    this.removeFromSeries = this.removeFromSeries.bind(this);
  }

  componentDidMount() {
    this.getUserId(this.props.location.username);
    this.getYouTubeVideos('javascript');
  }
  
  getUserId(user) {
    axios
      .get('/user/id', { params: { user: user }})
      .then((data) => {
        this.setState({ userId: data.data[0].id}, () => this.showVideoList());
      })
  }

  showVideoList() {
    axios
      .get('/owner/videoList', {params: {userId: this.state.userId}})
      .then(({data}) => {
        
        // iterate through data and pull out all the series names
        let seriesObj = {};
        for (var video of data) {
          if (!seriesObj[video.series]) { // && video.series !== null
            seriesObj[video.series] = true;
          }
        }

        this.setState({
          videos: data,
          allVideos: data,
          seriesList: Object.keys(seriesObj),
        });
      });
  }

  sendToSelectedVideo(video) {
    this.props.history.push({
      pathname: '/owner/video',
      video: video, 
      userId: this.state.userId
    });
  }

  getYouTubeVideos(query) {
    axios
      .get('/owner/searchYouTube', {params: {query: query}})
      .then(({data}) => {
        this.setState({
          searchedVideos: data,
          selectedSeries: 'All Videos',
        });
      });
  }

  saveVideo(video) {
    axios
      .post('/owner/video', {video: video, userId: this.state.userId})
      .then(() => {
        this.showVideoList();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteVideo(video) {
    axios
      .delete('/owner/video', { params: { video: video, userId: this.state.userId }})
      .then(() => {
        this.showVideoList();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  handleChange(event, index, value) {
    this.setState({
      selectedSeries: value
    }, () => {
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

  filterBySeries(series) {
    let filteredArr = [];
    let allVideos = [...this.state.allVideos];

    for (var video of allVideos) {
      if (video.series === series) {
        filteredArr.push(video);
      }
    }

    this.setState({
      videos: filteredArr,
    });
  }

  removeFromSeries(video) {
    axios
      .delete('/owner/build', { params: { video }})
      .then(result => {
        let allVideos = this.state.allVideos;

        for (var item of allVideos) {
          if (video.id === item.id) {
            // reset series client-side
            item.series = null;
          }
        }

        this.setState((prevState) => ({
          videos: prevState.videos.filter((item, i) => item.id !== video.id),
          allVideos: allVideos,
        }));
      })
      .catch(err => {
        console.log(err);
      });
  }

  render () {
    return (
      <Paper style={style} zDepth={1}>
      <div id="owner-homepage-app">
        <header className="navbar"><h1>Hello {this.props.location.username}</h1></header>
        <div className="main">
          Search YouTube and add videos to your classroom: <Search getVideos={this.getYouTubeVideos}/>
          <Paper style={searchStyle} zDepth={1}>
            <DropDownMenu name="selectedSeries" value={this.state.selectedSeries} onChange={this.handleChange} style={{width: '200px'}}>
            {this.state.seriesList.length === 0 ? null : this.state.seriesList.map((series, idx) => {
              // null is being coerced to 'null' at some point --> hence 'null' check
              if (series === 'null') { series = 'All Videos'; }
              
              // convert 'All Videos' to 'Select Series' for use within dropdown
              let altMenuItemText = undefined;
              if (series === 'All Videos') { altMenuItemText = 'Select Series'; }
              
              return (
                <MenuItem key={idx} value={series} primaryText={altMenuItemText || series}/>
              )
            })}
            </DropDownMenu>
          </Paper>
          <div >
            {this.state.searchedVideos.length === 0 ? <div style={hidden}></div> : <SearchList videosInSeries={this.state.videos} selectedSeries={this.state.selectedSeries} videos={this.state.searchedVideos} save={this.saveVideo} redirect={this.sendToSelectedVideo}/>}
            <Hidden deleteVideo={this.deleteVideo}/>
            <VideoList 
              userId={this.state.userId}
              videos={this.state.videos} 
              redirect={this.sendToSelectedVideo}
              deleteVideo={this.deleteVideo}
              save={this.saveVideo}
              selectedSeries={this.state.selectedSeries}
              removeFromSeries={this.removeFromSeries}
            />
          </div>
        </div>  
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
  display: 'inline-block',
  padding: '30px',
  background: '#D8E4EA',
};

const hidden = {
  height: '70vh',
  float: 'left',
  width: '40%',
};

const searchStyle = {
  height: 'auto',
  width: 'auto',
  margin: '20px',
  textAlign: 'center',
  display: 'block',
  padding: '10px',
};

export default withRouter(OwnerHomepage);