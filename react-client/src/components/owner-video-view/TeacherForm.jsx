import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';

class TeacherForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(comment) {
    this.setState({
      comment: comment
    })
  }

  handleClick() {
    this.props.save(this.props.start, this.props.end, this.state.comment, () => {
      this.setState({
        comment: ''
      })
    });
  }

  render() {
    return(
      <div>
        <AutoComplete dataSource={[]} 
          refs={"autocomplete"} 
          searchText={this.state.comment}
          onUpdateInput={this.handleChange}
        />
        <br/>
        <RaisedButton 
          style={{margin: '5px'}} 
          onClick={this.handleClick}
          label="Add"/>
      </div>
    )
  }
}


export default TeacherForm;


/* 
             Comment: <input name="comment" id="comment" value={this.state.comment} onChange={this.handleChange}></input> */