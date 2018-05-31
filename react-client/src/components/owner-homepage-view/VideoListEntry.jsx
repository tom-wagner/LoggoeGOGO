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
    isDragging: monitor.isDragging()
  };
}

class VideoListEntry extends React.Component {
  render() {
    const { video, redirect, btnClickFunc, btnClickAction, connectDragSource } = this.props;
    return connectDragSource(
      <div>
        <Paper style={style} key={video.id}>
          <div key={video.id} style={{display: 'inline-block'}}>
            <div style={{width: '30%', float: 'left'}}>
              <img className="media-object" 
                src={video.image} 
                alt="" />
            </div>
            <div style={{width: '50%', float: 'right'}}>
              <div className="videoTitle" style={{fontWeight: 'bold'}} onClick={()=>{redirect(video)}}> {video.title} </div>
              <br/>
              <div style={{color: 'grey', marginBottom: '10px'}}>{video.description}</div>
              <RaisedButton style={{padding: '5px', height: 'auto'}} onClick={() => {btnClickFunc(video)}}>
              {btnClickAction}
              <br/>
                <DeleteIcon></DeleteIcon>
              </RaisedButton>
              <br/>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

const style = {
  height: 'auto',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px 5px',
  cursor: 'move',
  wordWrap: 'break-word',
};

export default DragSource(ItemTypes.SAVED, videoSource, collect)(VideoListEntry);
