import {withRouter} from 'react-router-dom'; // done
import React from 'react'; // done
import axios from 'axios'; // done

import Hidden from './shared-components/Hidden.jsx'; // done
import AllVideos from './owner-build-series-view/AllVideos.jsx'; // done
import SeriesList from './owner-build-series-view/SeriesList.jsx'; // done
import Search from './owner-homepage-view/Search.jsx'; // do I need this??
import Paper from 'material-ui/Paper';

class OwnerHomepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      video: '',
      userId: '',
      searchedVideos: [],
      videosInSeries: [],
      videosInDB: 1000 // set to an arbitrary number >= 2 for rendering logic purposes --> updated instantly at page load
    }
    this.getUserId = this.getUserId.bind(this);
    this.showVideoList = this.showVideoList.bind(this);
    this.sendToSelectedVideo = this.sendToSelectedVideo.bind(this);
    this.getYouTubeVideos = this.getYouTubeVideos.bind(this);
    this.saveVideo = this.saveVideo.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
    this.addToSeries = this.addToSeries.bind(this);
    this.saveSeries = this.saveSeries.bind(this);
    this.removeFromSeries = this.removeFromSeries.bind(this);
  }

  componentDidMount() {
    this.getUserId(this.props.location.username);
    this.getYouTubeVideos('javascript');
  }
  
  getUserId(user) {
    axios
      .get('/user/id', {params: {user: user}})
      .then((data) => {
        this.setState({userId: data.data[0].id}, ()=> this.showVideoList());
      });
  }

  showVideoList() {
    axios
      .get('/owner/videoList', {params: {userId: this.state.userId}})
      .then(({data}) => {this.setState({
        videos: data,
        videosInDB: data.length,
      })});
  }

  sendToSelectedVideo(video) {
    this.props.history.push({
      pathname: '/owner/video',
      video: video, 
      userId: this.state.userId,
    });
  }

  getYouTubeVideos(query) {
    axios.get('/owner/searchYouTube', {params: {query: query}})
    .then(({data}) => {
      console.log('client side', data)
      this.setState({
        searchedVideos: data
      })
    });
  }

  saveVideo(video) {
    axios.post('/owner/save', {video: video, userId: this.state.userId})
    .then(() => {
      console.log('Video saved.');
      this.showVideoList();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  deleteVideo(video) {
    axios.post('/owner/delete', {video: video, userId: this.state.userId})
    .then(() => {
      console.log('Video deleted');
      this.showVideoList();
    })
    .catch((err) => {
      console.log(err);
    })
  }

  addToSeries(video) {
    let videosInSeries = this.state.videosInSeries;
    videosInSeries.push(video);

    this.setState((prevState) => ({
      videosInSeries: videosInSeries,
      videos: prevState.videos.filter((item, i) => item.id !== video.id) 
    }));
  }

  removeFromSeries(video) {
    let videos = this.state.videos;
    videos.push(video);

    this.setState((prevState) => ({
      videos: videos,
      videosInSeries: prevState.videosInSeries.filter((item, i) => item.id !== video.id),
    }));
  }

  saveSeries(videoList, userId, username, series) {
    // var seriesData = { videoList, userId, username };
    axios
      .post('/owner/build', { videoList, userId, username, series })
      .then((result) => {
        window.alert('Series saved! Navigate to home page to view the series.');
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
            <p>Drag videos from the left column to the right column or click "Add to Series" to create a video series, then save the series by hitting the save button below</p>
            <p><i>**Only videos not currently in a series can be added to a new series and as such only those videos are shown below</i></p>
            
            
            <div>
              <AllVideos
                videos={this.state.videos}
                videosInDB={this.state.videosInDB}
                save={this.saveVideo}
                redirect={this.sendToSelectedVideo}
                addToSeries={this.addToSeries} />
              <Hidden deleteVideo={this.deleteVideo}/>
              <SeriesList 
                userId={this.state.userId}
                username={this.props.location.username}
                videos={this.state.videos}
                redirect={this.sendToSelectedVideo}
                addToSeries={this.addToSeries}
                saveSeries={this.saveSeries}
                videosInSeries={this.state.videosInSeries}
                removeFromSeries={this.removeFromSeries} />
            </div>
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
};

const hidden = {
  height: '70vh',
  float: 'left',
  width: '40%',
};

export default withRouter(OwnerHomepage);