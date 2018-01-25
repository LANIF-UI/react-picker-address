/* eslint-disable no-console */
import 'module-boot/assets/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Picker from '../src';
import '../assets/index.less';
import { district } from './district';

class Sampleaaa extends React.Component {
  state = {
    visible: false,
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
        <input onClick={this.showPicker} placeholder="请选择地区" readOnly />
        <Picker visible={this.state.visible} onClose={this.hidePicker} dataSource={district} />
      </div>
    );
  }
}

ReactDOM.render(<Sampleaaa />, document.getElementById('__react-content'));
