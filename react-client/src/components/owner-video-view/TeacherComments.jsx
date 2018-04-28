import React from 'react';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';


const TeacherComments = (props) => (
  <div>
    {props.comments.map((comment) => {
      return (
        <div>
          <div style={timeStyle}>{comment.begRange} - {comment.endRange}</div>
          <div>{comment.comment}</div>
          <IconButton onClick={() => {props.deleteComment(comment)}}>
            <DeleteIcon/>
          </IconButton>
        </div>
      )
    })}
  </div>
)

const timeStyle = {
  float: 'left',
  fontWeight: '800'
}


export default TeacherComments;