const bodyParser = require('body-parser');
const express = require('express');
const moment = require('moment');
const axios = require('axios');
const session = require('express-session');
const path = require('path')
const childProcess = require('child_process');
const {
  getOwnerTimestamp,
  getCurrentVideo,
  getOwnerVideos,
  getTimestamp, 
  getAllVideos, 
  getUserId,
  getUser, 
  setTimestamp, 
  setVideo, 
  setUser,
  getBuckets,
  deleteTimestamp,
  deleteVideo,
  getTeachers, 
  getChats,
  postChats,
  getUploads,
  setUploads,
  deleteUpload,
  setTeacherComment,
  getOwnerComments,
  deleteOwnerComment,
  saveSeries,
  getTimestamps,
  removeFromSeries,
} = require('../database-mysql');

const searchYouTube = require ('youtube-search-api-with-axios');
const api = require('../config.js').API;

const app = express();

//---------------------------------------------------------SESSIONS
app.use(session({
  secret: 'keyboard cat'
}));

//---------------------------------------------------------MIDDLEWARE

app.use(express.static(__dirname + '/../react-client/dist'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//---------------------------------------------------------VISUALIZATION DATA

app.get('/vis-data', (req, res) => {
  const VIDEO_ID = req.query.videoId;
  getTimestamps(VIDEO_ID, (comments) => {
    var child = childProcess.spawn('python',
      ['server/dpgmm/dpgmm_script.py', comments.map(d => d.timeStamp).join(',')]);
    child.stdout.on('data', (data) => {
      data = data.toString();
      if (data[0] !== '[') {
        res.status(400).send('NOT ENOUGH DATA');
      } else {
        getCurrentVideo(VIDEO_ID, (results) => {
          res.status(200).send({
            data: JSON.parse(data),
            length: results[0].duration / 60,
            comments: comments.map(d => d.comment)
          });
        })
      }
    });
    child.on('error', (err) => {
      console.log('ERROR', err);
    })
    child.on('exit', (code, signal) => {
      console.log(`child process exited with code ${code} and signal ${signal}`);
    });
  });
})
//---------------------------------------------------------USER LOGIN

app.post('/login', (req, res) => {
  getUser(req.body.username, (err, response) => {
    if (err) {
      res.status(403).send(err);
    } else {
      if (response.length === 0) {
        res.status(403).send('user not found');
        return;
      }
      req.session.regenerate((err) => {
        if (err) {
          console.log(err);
        }
        if (response.length === 0) {
          res.status(404).send('Username not found');
        } else {
          req.session.user = response[0].name;
          req.session.isOwner = response[0].owner;
          req.session.userId = response[0].id;
          res.status(201).send(response);
        }
      })
    }
  });
});

//---------------------------------------------------------USER REGISTRATION

app.post('/register', (req, res) => {
  getUser(req.body.username, (err, response) => {
    if (err) res.status(403).send(err);
    
    let isExist = !!response.length;

    if (isExist) {
        res.status(201).send(true);
    }
    else {
      setUser(req.body, (err, response) => {
        getUser(req.body.username, (err, response) => {
          req.session.regenerate((err) => {
            if (err) {
              console.log(err);
            }
            req.session.user = response[0].name;
            req.session.isOwner = response[0].owner;
            req.session.userId = response[0].id;
            res.status(201).send(false)
          });
        });
      });      
    }
  });
});

//---------------------------------------------------------USER REGISTRATION

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).send('yay');
});

//---------------------------------------------------------USER ID
//get userId for owner homepage and homepage
app.get('/user/id', (req, res) => {
  getUserId(req.query.user, (userId) => {
    res.send(userId);
  });
})

//---------------------------------------------------------USER LOGIN STATUS

// Returns an object with props:
// isLoggedIn: bool
// username: string or undefined if not logged in
// isOwner: bool or undefined if not logged in

app.get('/user/loginstatus', (req, res) => {
  if (req.session.user === undefined) {
    res.send({
      isLoggedIn: false
    });
    return;
  }
  res.send({
    isLoggedIn: true,
    username: req.session.user,
    isOwner: req.session.isOwner,
    userId: req.session.userId
  });
});

//---------------------------------------------------------STUDENT USER REQUESTS
//get all videos for student homepage
app.get('/student/homepage', (req, res) => getAllVideos((videos) => res.send(videos)));

app.get('/student/teachers', (req, res) => {
  getTeachers((teachers) => {
    res.send(teachers);
  })
});

app.get('/student/videos', (req, res) => {
  let teacher = req.query.teacher;
  getOwnerVideos(teacher, (data) => {
    res.send(data);
  });
});

//---------------------------------------------------------OWNER USER REQUESTS

app.get('/owner/searchYoutube', (req, res) => {
  searchYouTube({key: api, q: req.query.query, maxResults: 10}, 
    (videos) => {
      res.status(200).send(videos);
    }
  );
});

app.post('/owner/video', (req, res) => {
  let video = req.body.video;
  let userId = req.body.userId;
  let url = `https://www.googleapis.com/youtube/v3/videos?id=${video.id.videoId}&part=contentDetails&key=${api}`;
  axios
    .get(url)
    .then((data) => {
      let duration = moment.duration(data.data.items[0].contentDetails.duration, moment.ISO_8601).asSeconds();
      setVideo(video, userId, duration, () => {
        res.send('Saved to db');
      });
    });
});

app.delete('/owner/video', (req, res) => {
  let userId = JSON.parse(req.query.userId);
  let videoId = JSON.parse(req.query.video);
  deleteVideo(userId, videoId.videoId, () => {
    res.send('Removed from db');
  });
});

//get all videos for owner.
app.get('/owner/videoList', (req, res) => {
  getOwnerVideos(req.query.userId, (videos) => {
    res.send(videos);
  });
});

//---------------------------------------------------------OWNER COMMENTS
app.post('/owner/comment', (req, res) => {
  setTeacherComment(req.body.comment, req.body.videoId, req.body.userId, req.body.start, req.body.end, (comment) => {
    res.send('Comment saved to DB');
  });
});

app.get('/owner/comment', (req, res) => {
  getOwnerComments(req.query.videoId, (comments) => {
    res.send(comments);
  });
});

app.delete('/owner/comment', (req, res) => {
  let query = JSON.parse(req.query.comment)
  deleteOwnerComment(query.id, (comment) => {
    res.send('Comment deleted from DB');
  })
});

//---------------------------------------------------------ANALYTICS

app.get('/buckets', (req,res) => {
  const params = req.query
  getBuckets(params, (data) => {
    data.sort(function (a, b) {
      return Number(a.TimeStampGroup.match(/\d+/)) - Number(b.TimeStampGroup.match(/\d+/));
    });
    res.json(data)
  });
});

//---------------------------------------------------------WORKING WITH STUDENT COMMENTS

app.get('/timestamps', (req, res) => {
  let videoId = req.query.videoId
  getTimestamp(videoId, req.query.userId, (data) => {
    res.json(data);
  });  
});


app.get('/timestamps/owner', (req, res) => {
  let videoId = req.query.videoId
  getOwnerTimestamp(videoId, (data) => {res.send(data)});  
});

app.post('/timestamps', (req, res) => {
  let params = req.body.params;
  setTimestamp(params, (success) => {res.status(201).send()});
});

app.delete('/timestamps', (req, res) => {
  let params = req.query;
  deleteTimestamp(params, (success) => {res.send()})
});

//---------------------------------------------------------TEACHER UPLOADS

app.post('/teacherUpload', (req, res) => {
  setUploads(req.body, (err, results) => {
    (err) ?
    console.error('ERROR IN SERVER POST UPLOADS: ', err) :
    res.status(201).send(results);
  });
});

app.get('/teacherUpload', (req, res) => {
  // console.log('in get teacher uploads', req.query)
  getUploads(req.query, (err, results) => {
    (err) ?
    console.error('ERROR IN SERVER GET UPLOADS: ', err) :
    res.status(200).send(results);
  });
});

app.delete('/teacherUpload', (req, res) => {
  deleteUpload(req.body.url, (err, results) => {
    (err) ?
    console.error('ERROR IN SERVER DELETE UPLOAD: ', err) :
    res.send('Successfully removed upload from DB', results);
  });
});

//---------------------------------------------------------DEFAULT ROUTE
app.get('/*/bundle.js', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../react-client/dist/bundle.js'));
})
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../react-client/dist/index.html'));
})

//---------------------------------------------------------SERVER
let server = app.listen(3000, () => {
  console.log('listening on port 3000!');
});

//---------------------------------------------------------CHATROOM

const io = require('socket.io')(server);
let users = [];
let connections = [];

io.on('connection', (socket) => {
  connections.push(socket);

  socket.on('disconnect', (data) => {
    connections.splice(connections.indexOf(socket), 1);
  });

  socket.on('send message', (data) => {
    io.sockets.emit('new message', {msg: JSON.stringify(data)})
  });
});

//adds chat messages to the chats db
app.post('/chats', (req, res) => {

  postChats(req.body, (err, results) => {
    (err) ?
    console.error('ERROR IN SERVER POSTCHATS: ', err) :
    res.status(201).send(results);
  })
})

app.post('/chatInfo', (req, res) => { //change to get request
  // console.log('req in server get chats', req.body)
  getChats(req.body, (err, results) => {
    (err) ?
    console.error('ERROR IN SERVER GETCHATS: ', err) :
    res.status(201).send(results);
  });
})

//---------------------------------------------------------OWNER BUILD SERIES

// BUILD SERIES
app.post('/owner/build', (req, res) => {
  saveSeries(req.body)
    .then(result => {
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

// REMOVE VIDEO FROM SERIES
app.delete('/owner/build', (req, res) => {
  let video = JSON.parse(req.query.video);
  removeFromSeries(video, (err, result) => {
    err ? res.status(500).send('error') : res.status(200).send(result);
  });
});
