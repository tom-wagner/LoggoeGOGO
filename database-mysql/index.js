// MYSQL DATABASE QUERYING FUNCTIONS:
const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'oneTeam'
});
//---------------------------------------------------------USER QUERIES
//-------------------------------------------- GET REQUESTS
const getUser = (user, callback) => {
  let query = `SELECT * FROM users WHERE name = "${user}"`;
  connection.query(query, (err, results) => {
    (err) ?
      console.error(err) :
      callback(err, results);
  });
}
  
  const getUserId = (user, callback) => {
    let query = `SELECT id FROM users WHERE name = "${user}"`;
    connection.query(query, (err, results) => {
      (err) ?
        console.error(err) :
        callback(results);
    });
  } 
  const getTeachers = (callback) => {
    let query = `SELECT * FROM users WHERE owner = 1`;
    
    connection.query(query, (err, results) => {
      (err) ?
        console.error(err) :
        callback(results);
    })
  }
//-------------------------------------------- SET REQUESTS
const setUser = (user, callback) => {
  var query = `INSERT IGNORE INTO users (name, owner) VALUES (?, ?);`
  connection.query(query, [user.username, user.isOwner], (err, results) => {
    (err) ?
      console.error(err) :
      callback(err, results);
  })
}
//---------------------------------------------------------OWNER QUERIES
const setTeacherComment = (comment, videoId, userId, start, end, callback) => {
  const query = `INSERT INTO teacherComments (comment, videoId, userId, begRange, endRange) VALUES (?, ?, ?, ?, ?);`;
  const values = [comment, videoId, userId, start, end];
  connection.query(query, values, (err, results) => {
    (err) ?
      console.log('error saving teacher comment', err) :
      callback(results);
  })
}
const getTimestamps = (videoId, callback) => {
  const query = `SELECT * FROM timeStamps WHERE videoId='${videoId}'`;
  connection.query(query, (err, results) => {
    (err) ? 
      console.log('Could not retrieve teacher comments', err) :
      callback(results);
  })
}
const getOwnerComments = (videoId, callback) => {
  const query = `SELECT * FROM teacherComments WHERE videoId='${videoId}'`;
  connection.query(query, (err, results) => {
    (err) ? 
      console.log('Could not retrieve teacher comments', err) :
      callback(results);
  })
}
const deleteOwnerComment = (commentId, callback) => {
  const query = `DELETE FROM teacherComments WHERE id=${commentId}`;
  connection.query(query, (err, results) => {
    (err) ? 
      console.log('Could not delete comment', err) :
      callback(results);
  })
}
//---------------------------------------------------------VIDEO QUERIES
//-------------------------------------------- GET REQUESTS
const getAllVideos = (callback) => {
  const query = 'SELECT * FROM videos';
  connection.query(query, (err, results) => {
    (err) ?
      console.log('Did not get videos from database', err) :
      callback(results);
  });
};
const getCurrentVideo = (videoId, callback) => {
  const query = `SELECT * FROM videos WHERE videoId='${videoId}'`;
  connection.query(query, (err, results) => {
    (err) ?
      console.log('err', err) :
      callback(results);
  })
}
const getOwnerVideos = (userId, callback) => {
  const query = `SELECT * FROM videos WHERE userId='${userId}'`;
  connection.query(query, (err, results) => {
    (err) ?
      console.log('Did not get videos from database', err) :
      callback(results);
  });
};
const getBuckets = function({videoId, duration}, callback) {
  let bucketFloors = []
  for (let i = 0; i < duration; i+=duration/10) {
    bucketFloors.push(Math.floor(i))
  }
  connection.query(`select TimeStampGroup,
  count(*) as total
  from (
    select case when timestamp between ${bucketFloors[0]} and ${bucketFloors[1]} then '${bucketFloors[0]}-${bucketFloors[1]}' 
      when timestamp between ${bucketFloors[1]} and ${bucketFloors[2]} then '${bucketFloors[1]}-${bucketFloors[2]}' 
      when timestamp between ${bucketFloors[2]} and ${bucketFloors[3]} then '${bucketFloors[2]}-${bucketFloors[3]}' 
      when timestamp between ${bucketFloors[3]} and ${bucketFloors[4]} then '${bucketFloors[3]}-${bucketFloors[4]}' 
      when timestamp between ${bucketFloors[4]} and ${bucketFloors[5]} then '${bucketFloors[4]}-${bucketFloors[5]}' 
      when timestamp between ${bucketFloors[5]} and ${bucketFloors[6]} then '${bucketFloors[5]}-${bucketFloors[6]}' 
      when timestamp between ${bucketFloors[6]} and ${bucketFloors[7]} then '${bucketFloors[6]}-${bucketFloors[7]}'
      when timestamp between ${bucketFloors[7]} and ${bucketFloors[8]} then '${bucketFloors[7]}-${bucketFloors[8]}'
      when timestamp between ${bucketFloors[8]} and ${bucketFloors[9]} then '${bucketFloors[8]}-${bucketFloors[9]}'
      else '${bucketFloors[9]}+' end as TimeStampGroup
      from timeStamps WHERE videoId = '${videoId}'
    ) t
    group by TimeStampGroup order by TimeStampGroup;`, 
    function(err, results, fields) {
      if(err) {
        console.error(err);
      } else {
        callback(results);
      }
    })
}
//-------------------------------------------- POST REQUESTS
const setVideo = (video, userId, duration, callback) => {
  console.log(duration)
  const query = "INSERT IGNORE INTO videos (videoId, title, description, image, userId, duration) VALUES (?, ?, ?, ?, ?, ?);";
  const values = [video.id.videoId, video.snippet.title, video.snippet.description, video.snippet.thumbnails.default.url, userId, duration];
  connection.query(query, values, (err, result) => {
    (err) ?
      console.log('Video is not saved', err) :
      callback();
  })
}
//---------------------------------------------------------TIMESTAMP QUERIES
//-------------------------------------------- GET REQUESTS
const getTimestamp = (videoId, userId, callback) => {
  const query = `SELECT timestamp, comment, id, videoId, userId, username, addressedByTeacher, commentType, video FROM timeStamps WHERE videoId = '${videoId}' ORDER BY timestamp asc;`
  connection.query(query, (err, results, fields) => {
    (err) ?
      console.error(err) :
      console.log('results from db: ', results); 
      callback(results);
  })
}
const getOwnerTimestamp = (videoId, callback) => {
  const query = `select timestamps.comment, timestamps.timestamp, users.name from timestamps inner join users on users.id = timestamps.userId WHERE timestamps.videoId = '${videoId}' ORDER BY timestamp asc;`;
  connection.query(query, (err, results, fields) => {
    (err) ?
      console.error(err) :
      callback(results);
  })
}
//-------------------------------------------- POST REQUESTS
const setTimestamp = ({userId, videoId, timestamp, comment}, callback) => {
  const query = `INSERT INTO timeStamps (userId, videoId, timeStamp, comment) VALUES (?, ?, ?, ?);`;
  const values = [userId, videoId, timestamp, comment];
  connection.query(query, values, (err, results, fields) => {
    (err) ?
      console.error(err) :
      callback(results);
  });
};
//-------------------------------------------- DELETE REQUESTS
const deleteTimestamp = ({userId, videoId, id}, callback) => {
  const query = `DELETE FROM timeStamps WHERE userId = ${userId} AND videoId = '${videoId}' AND id = ${id};`
  connection.query(query, (err, results, fields) => {
    (err) ?
      console.error(err) :
      callback(results);
  })
}
const deleteVideo = (userId, videoId, callback) => {
  const query = `DELETE FROM videos WHERE userId = ${userId} AND videoId = '${videoId}'`
  
  connection.query(query, (err, results) => {
    (err) ?
    console.error(err) : 
    callback(results);
  })
}
//---------------------------------------------------------CHATS QUERIES
//-------------------------------------------- GET REQUESTS
const getChats = ({videoId}, callback) => {
  const query = `SELECT * FROM chats WHERE videoId='${videoId}'`;
  connection.query(query, (err, results) => {
    (err) ?
      console.log('err', err) :
      callback(err, results);
  })
}
//-------------------------------------------- POST REQUESTS
const postChats = ({ username, timeStamp, videoId, text }, callback) => {
  var query = `INSERT INTO chats (username, timeStamp, videoId, text) VALUE (?, ?, ?, ?);`;
  connection.query(query, [username, timeStamp, videoId, text],(err, results) => {
    err ? console.error(err) : callback(err, results);
  });
};
//---------------------------------------------------------UPLOADS QUERIES
//-------------------------------------------- GET REQUESTS
const getUploads = ({videoId, username}, callback) => {
  
  const query = `SELECT * FROM uploads WHERE videoId='${videoId}'`;
  connection.query(query, (err, results) => {
    (err) ?
      console.log('err', err) :
      callback(err, results);
  })
}
//-------------------------------------------- POST REQUESTS
const setUploads = (data, callback) => {
  console.log("data", data.data);
  data.data.map(({videoId, url, filename, mimetype, size}) => {
    var query = `INSERT INTO uploads (videoId, url, filename, fileType, size) VALUE (?, ?, ?, ?, ?);`;
    connection.query( query, [videoId, url, filename, mimetype, size], (err, results) => {
      err ? console.error(err) : callback(err, results);
    });
  });
};

const deleteUpload = (url, callback) => {
  const query = `DELETE FROM uploads WHERE url = '${url}'`
  
  connection.query(query, (err, results) => {
    (err) ?
    console.error(err) : 
    callback(results);
  })
}

//-------------------------------------------- SAVE SERIES TO DB

const saveSeries = ({ videoList, userId, username, series }, callback) => {

  const updateSeries = query => {
    return new Promise((resolve, reject) => {
      try {
        connection.query(query, (err, result) => {
          if (err) {
            return reject(err)
          } else {
            return resolve(result);
          }
        })
      } catch (err) {
        return reject(err);
      }
    });
  };

  let queries = [];

  videoList.forEach((video, idx) => {
    let query = `UPDATE videos SET series = '${series}', idxInSeries = ${idx + 1} WHERE id = ${video.id} AND userId = ${userId};`;
    queries.push(updateSeries(query));
  });

  return Promise.all(queries);
};

//-------------------------------------------- REMOVE VIDEO FROM SERIES

const removeFromSeries = (video, callback) => {
  
  let query = `UPDATE videos SET series = null WHERE id = ${video.id};`;
  console.log('query');

  connection.query(query, (err, result) => {
    err ? callback(err, null) : callback(null, result);
  });
};


exports.getBuckets = getBuckets;
exports.getUser = getUser;
exports.setUser = setUser;
exports.setVideo = setVideo;
exports.setTimestamp = setTimestamp;
exports.getUserId = getUserId;
exports.getTimestamp = getTimestamp;
exports.getAllVideos = getAllVideos;
exports.getOwnerVideos = getOwnerVideos;
exports.getCurrentVideo = getCurrentVideo;
exports.getOwnerTimestamp = getOwnerTimestamp;
exports.deleteTimestamp = deleteTimestamp;
exports.deleteVideo = deleteVideo;
exports.getChats = getChats;
exports.postChats = postChats;
exports.getTeachers = getTeachers;
exports.getUploads = getUploads;
exports.setUploads = setUploads;
exports.deleteUpload = deleteUpload;
exports.setTeacherComment = setTeacherComment;
exports.getOwnerComments = getOwnerComments;
exports.deleteOwnerComment = deleteOwnerComment;
exports.saveSeries = saveSeries;
exports.getTimestamps = getTimestamps;
exports.removeFromSeries = removeFromSeries;
