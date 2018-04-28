import React from 'react';
import Paper from 'material-ui/Paper';
import { DragSource } from 'react-dnd';
import { ItemTypes } from '../../constants.js';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';

const videoSource = {
  beginDrag(props) {
    console.log('begin dragging', props)
    const item = {item: props.video}
    console.log(item)
    return item;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

class SeriesListEntry extends React.Component {

  render() {
    // NEED TO UPDATE:
    const { video, idx, redirect, removeFromSeries, connectDragSource } = this.props;
    return connectDragSource(
      <div>
        <Paper style={style} key={video.id}>
          <div key={video.id} style={{display: 'inline-block'}}>
            <div style={{width: '30%', float: 'left'}}>
              <img style={add10pxBottom} className="media-object" src={video.image} alt="" />
              <p><i>{`Sequence in series: ${idx + 1}`}</i></p>
            </div>
            <div style={{width: '50%', float: 'right'}}>
              <div style={boldAnd10pxBottom} onClick={()=>{redirect(video)}}> {video.title} </div>
              <div style={greyAnd10pxBottom}> {video.description} </div>
              <RaisedButton style={add10pxBottom} onClick={() => {removeFromSeries(video)}}>
              Remove from Series
              <DeleteIcon></DeleteIcon>
              </RaisedButton>
            </div>
          </div>
        </Paper>
      </div>
    )
  }
}

const style = {
  height: 'auto',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px 5px'
};

const add10pxBottom = {
  marginBottom: '10px',
  padding: '5px',
  height: 'auto'
};

const boldAnd10pxBottom = {
  marginBottom: '10px',
  fontWeight: 'bold',
};

const greyAnd10pxBottom = {
  marginBottom: '10px',
  color: 'grey',
};

export default DragSource(ItemTypes.SAVED, videoSource, collect)(SeriesListEntry);
