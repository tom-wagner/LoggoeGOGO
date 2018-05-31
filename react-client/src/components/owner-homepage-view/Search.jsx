import React from 'react';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';

class Search extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userInput: ''
    };
    this.updateInput = this.updateInput.bind(this);
    this.onNewRequest = this.onNewRequest.bind(this);
  }

  updateInput(input) {
    this.setState({
      userInput: input
    }); 
  }

  onNewRequest(input) {
    this.props.getVideos(input);
    this.refs['autocomplete'].setState({searchText:''});
  }

  render() {
    return (
      <Paper style={style} zDepth={1}>
        <div id="owner-homepage-search-bar">
          <AutoComplete 
            dataSource={[]} 
            type="text"
            ref={'autocomplete'}
            onUpdateInput={this.updateInput}
            onNewRequest={this.onNewRequest}
          />
          <RaisedButton 
            label="Search" 
            value="search"
            onClick={() => {
              this.props.getVideos(this.state.userInput);
              this.refs['autocomplete'].setState({searchText:''});
            }} 
          />

        </div>
      </Paper>
    );
  }
}

const style = {
  height: '100%',
  width: 'auto',
  margin: '20px',
  textAlign: 'center',
  display: 'inline-block',
  padding: '10px',
};

const button = {
  height: '10px',
};

export default Search