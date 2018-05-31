import React from 'react';
import VideoListEntry from './VideoListEntryView.jsx';
import Paper from 'material-ui/Paper';

const VideoList = ({videos, redirect}) => {
  const style = {
    height: 'auto',
    width: 'auto',
    margin: '30px',
    textAlign: 'center',
    display: 'block',
    padding: '30px 5px',
  };

  return (
    <Paper style={style}>
    <div>
      {videos.length === 0 ? 'This teacher has not yet uploaded any videos.' : videos.map((video, i) => <VideoListEntry key={i} video={video} redirect={redirect}/>)}
    </div>
    </Paper>
)}

export default VideoList;