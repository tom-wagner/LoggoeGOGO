import React from 'react';
import Paper from 'material-ui/Paper';

const VideoListEntry = ({video, redirect}) => {
  return (
    <Paper style={style}>
      <div style={{display: 'inline-block'}}>
        <div onClick={()=>{redirect(video.videoId)}}>
          <div style={style1}>
            <img src={video.image} alt="" />
          </div>
          <div style={style2}>
            <div className="videoTitle">{video.title}</div>
            <br/>
            <div>{video.description}</div>
          </div>
        </div>
      </div>
    </Paper>
  )
}

const style = {
  height: 'auto',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px 5px',
};

const style1 = {
  width: '30%', 
  float: 'left',
};

const style2 = {
  width: '50%', 
  float: 'right',
};

export default VideoListEntry;
