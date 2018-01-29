/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import Picker from '../src';
import '../assets/index.less';
import { district } from './district';

class PickerDemo extends React.Component {
  state = {
    visible: false,
    address: '',
  }

  onChange = (value, selectedRows) => {
    this.setState({
      address: selectedRows.map(item => item.title).join(','),
      visible: false,
    });
    console.log('选择值:', value);
  }

  showPicker = () => {
    this.setState({
      visible: true,
    });
  }

  hidePicker = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div>
        <input onClick={this.showPicker} value={this.state.address} placeholder="请选择地区" readOnly />
        <Picker
          visible={this.state.visible}
          onClose={this.hidePicker}
          dataSource={district}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

ReactDOM.render(<PickerDemo />, document.getElementById('__react-content'));
