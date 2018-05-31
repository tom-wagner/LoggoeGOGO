import React from 'react';
import axios from 'axios';
import c3 from 'c3';

class Analytics extends React.Component {
  constructor(props) {
    super(props)

    this.state = { 
      buckets: [],
      counts: [],
    };

    this.getBuckets=this.getBuckets.bind(this);
    this.createChart=this.createChart.bind(this);
  }

  componentDidMount() {
    this.getBuckets();
  }

  getBuckets() {
    axios.get('/buckets', {
      params: {
        videoId : this.props.video.videoId,
        duration: this.props.video.duration,
      }
    })
    .then((data) => {
      this.setState({
        buckets: data.data.map((row) => row.TimeStampGroup),
        counts: data.data.map((row) => row.total)
      });
    });
  }

  createChart() {
    const data = this.state.counts.slice();
    data.unshift('buckets');

    const chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: [data],
        type: 'bar'
      },
      axis: {
        x: {
          type: 'category',
          categories: this.state.buckets
        }
      },
      bar: {
        width: { ratio: 1 }
      }
    });
  }

  render() {
    { this.createChart() }
    return (
      <div id="chart">
      </div>
    );
  }
}

export default Analytics;

