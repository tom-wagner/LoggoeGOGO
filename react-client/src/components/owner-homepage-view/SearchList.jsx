import React from 'react';
import Paper from 'material-ui/Paper';
import SearchListEntry from './SearchListEntry.jsx';
import moment from 'moment';

const SearchList = ({videos, redirect, save, videosInSeries, selectedSeries}) => {
  console.log('videos: ', videosInSeries);

  if (selectedSeries === null || selectedSeries === 'All Videos') {
    return (
      <div style={container}>
        <Paper style={style}>
        <h4>Search Results:</h4>
          <div>
            {videos.map((video, i) => <SearchListEntry key={i} video={video} redirect={redirect} save={save}/>)}
          </div>
        </Paper>
      </div>
    )
  } else {
    var totalDuration = 0;


    for (var item of videosInSeries) {
      totalDuration += item.duration;
    }

    var totalPrettified = convertTime(totalDuration);
    var averageDuration = totalDuration / videosInSeries.length;
    var averagePrettified = convertTime(averageDuration);

    return (
      <div style={container}>
        <Paper style={styleTextLeft}>
          <h2>Series Information:</h2>
          <h5><i>Series name:</i> {selectedSeries} </h5>
          <h5><i>Series length:</i> {videosInSeries.length} </h5>
          <h5><i>Average video duration:</i> {averagePrettified}</h5>
          <h5><i>Total series length:</i> {totalPrettified}</h5>
        </Paper>
      </div>
    );
  }

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

const styleTextLeft = {
  height: '100%',
  width: 'auto',
  margin: '30px',
  textAlign: 'left',
  display: 'block',
  padding: '30px 5px 0 15px',
  "overflowY": 'auto',
};

const container = {
  height: '75vh',
  float: 'left',
  width: '40%'
};

const convertTime = time => {
  let output = time >= 3600 ? moment.utc(time*1000).format('HH:mm:ss') : moment.utc(time*1000).format('mm:ss');
  return output;
}

export default SearchList;