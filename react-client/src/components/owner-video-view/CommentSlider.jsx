import React from 'react';
import Slider, {Range} from 'rc-slider';
import TeacherForm from './TeacherForm.jsx';
import moment from 'moment';

class CommentSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      start: '00:00',
      end: '00.00'
    }
    this.onSliderChange = this.onSliderChange.bind(this);
    this.convertTime = this.convertTime.bind(this);
    this.getTimeStamp = this.getTimeStamp.bind(this);
  }

  onSliderChange = (value) => {
    this.setState({
      start: this.convertTime(value[0]),
      end: this.convertTime(value[1])
    })
  }

  convertTime(time) {
    let output = time >= 3600 ? moment.utc(time*1000).format('HH:mm:ss') : moment.utc(time*1000).format('mm:ss');
    return output;
  }

  getTimeStamp(start) {
    console.log(start)
    var time;
    if (start.length === 5) {
      time = moment(start, 'mm:ss').diff(moment().startOf('day'), 'seconds');
    } else if (start.length === 2) {
      time = start;
    } else {
      time = moment(start, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
    }
    this.props.changeVideo(time);
  }

  render() {
    return(
      <div>
        <div style={{marginBottom: '10px', paddingTop: '10px'}}>Set time range:</div>
        <div style={style}>
          <Range allowCross={false} defaultValue={[0, 0]} min={0} max={this.props.video.duration} onChange={this.onSliderChange} onAfterChange={() => {this.getTimeStamp(this.state.start)}}/>
          <div>Start: {this.state.start} End: {this.state.end}</div>
        </div>
        <div>
          <TeacherForm save={this.props.save} video={this.props.video} start={this.state.start} end={this.state.end}/>
        </div>
      </div>
    )
  }
}

const style = {
  padding: '10px',
}


export default CommentSlider;


//<Slider value={this.state.value} onChange={this.onSliderChange} style={{width: '400', margin: '50'}}>Hello</Slider>