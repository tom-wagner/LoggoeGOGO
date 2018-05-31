import React from 'react';
import Paper from 'material-ui/Paper';
import AllVideosListEntry from './AllVideosListEntry.jsx';

const AllVideos = ({videos, videosInDB, redirect, save, addToSeries}) => {
  return (
    <div style={container}>
      <Paper style={style}>
        <div>
          {videosInDB < 2 ? <div>Save/add at least two videos to your classroom, then come back to build a series!</div> :
            videos.map(video => {
              // only render videos that are not already in a series
              if (video.series === null) {
                return (
                  <AllVideosListEntry key={video.id} video={video} redirect={redirect} save={save} addToSeries={addToSeries}/>
                );
              }
            })}
        </div>
      </Paper>
    </div>
  )
}

const style = {
  height: '100%',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px 5px',
  "overflowY": 'auto'
};

const container = {
  height: '75vh',
  float: 'left',
  width: '40%'
};

export default AllVideos;