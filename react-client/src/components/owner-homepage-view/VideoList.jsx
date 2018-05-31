import React from 'react';
import VideoListEntry from './VideoListEntry.jsx';
import Paper from 'material-ui/Paper';
import { ItemTypes } from '../../constants.js';
import { DropTarget } from 'react-dnd';

const videoSource = {
  drop(props, monitor) {
    let item = monitor.getItem();
    props.save(item.item);
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

class VideoList extends React.Component {

  render() {
    const { selectedSeries, videos, redirect, deleteVideo, removeFromSeries, connectDropTarget} = this.props;
    
    // conditionally toggle between removeFromSeries and deleteVideo depending on the videos being shown
    if (selectedSeries === null || selectedSeries === 'All Videos') {
      var conditionalFunction = deleteVideo;
      var conditionalPurpose = 'Remove from Videos';
    } else {
      var conditionalFunction = removeFromSeries;
      var conditionalPurpose = 'Remove from Series';
    }

    return connectDropTarget(
      <div style={container}>
        <Paper style={style}>
        {selectedSeries ? <h4>{`Series: ${selectedSeries}`}</h4> : null}
          <div>
            {videos.length === 0 ? 'Search for a video and drag it here to save it' : videos.map((video, i) => <VideoListEntry key={i} video={video} redirect={redirect} btnClickFunc={conditionalFunction} btnClickAction={conditionalPurpose}/>)}
          </div>
        </Paper>
      </div>
    )
  };
}

const style = {
  height: '100%',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px 5px',
  "overflowY": 'auto',
};

const container = {
  height: '75vh',
  float: 'right',
  width: '40%',
};

export default DropTarget(ItemTypes.VIDEO, videoSource, collect)(VideoList);