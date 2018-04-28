import React from 'react';
import SeriesListEntry from './SeriesListEntry.jsx';
import Paper from 'material-ui/Paper';
import { ItemTypes } from '../../constants.js';
import { DropTarget } from 'react-dnd';
import RaisedButton from 'material-ui/RaisedButton';

const videoSource = {
  // NEED TO UPDATE
  drop(props, monitor) {
    let item = monitor.getItem();
    props.addToSeries(item.item);
  }
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}

class SeriesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seriesDropDown: null,
      seriesInput: '',
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    this.setState({ seriesInput: evt.target.value });
  }

  render() {
    // NEED TO UPDATE
    const { userId, username, videosInSeries, videos, removeFromSeries, addToSeries, redirect, saveSeries, connectDropTarget} = this.props;
    
    // render input element if VideoSeriesList is not empty
    const conditionalInput = videosInSeries.length === 0 ?
      <div></div> :
      <div>
        Series Title: <input type="text" value={this.state.seriesInput} onChange={this.handleChange} />
      </div>

    // render save button if VideoSeriesList is not empty
    const conditionalSaveBtn = videosInSeries.length === 0 ?
      <div></div> :
      <div>
        <RaisedButton style={add10pxBottom} onClick={() => {saveSeries(videosInSeries, userId, username, this.state.seriesInput)}}>Save Series</RaisedButton>
      </div>

    return connectDropTarget(
      <div style={container}>
        <Paper style={style}>
          <div>
            {videosInSeries.length === 0 ? 'Drag a videos here to build a series!' : <div style={add10pxBottom} >Videos in series: {videosInSeries.length}</div> }
            {conditionalInput}<br/>
            {conditionalSaveBtn}
            {videosInSeries.length === 0 ? null :
              videosInSeries.map((video, idx) => {
                return (
                  <SeriesListEntry key={video.videoId} idx={idx} video={video} redirect={redirect} removeFromSeries={removeFromSeries}/>
                );
              })}
          </div>
        </Paper>
      </div>
    )
  }
}

const style = {
  height: '100%',
  width: 'auto',
  margin: '30px',
  textAlign: 'center',
  display: 'block',
  padding: '30px 5px',
  "overflowY": 'auto',
}

const container = {
  height: '75vh',
  float: 'right',
  width: '40%',
}

const add10pxBottom = {
  marginBottom: '10px',
  padding: '5px',
  height: 'auto'
}

export default DropTarget(ItemTypes.VIDEO, videoSource, collect)(SeriesList);