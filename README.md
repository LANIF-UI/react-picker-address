# react-picker-address
---

react 仿京东手机端地址选择组件.

[![NPM version][npm-image]][npm-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/react-picker-address.svg?style=flat-square
[npm-url]: http://npmjs.org/package/react-picker-address
[travis-image]: https://img.shields.io/travis/react-component/react-picker-address.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/react-picker-address
[coveralls-image]: https://img.shields.io/coveralls/react-component/react-picker-address.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/react-picker-address?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/react-component/react-picker-address.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/react-component/react-picker-address
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.11-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/react-picker-address.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-picker-address
## install

[![react-picker-address](https://nodei.co/npm/react-picker-address.png)](https://npmjs.org/package/react-picker-address)

## Usage

```js
import React from 'react';
import ReactDOM from 'react-dom';
import Picker from 'react-picker-address';
import 'react-picker-address/dist/react-picker-address.css';
import { district } from './district';

class PickerDemo extends React.Component {
  state = {
    visible: false,
    address: '',
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

  onChange = (value, selectedRows) => {
    this.setState({
      address: selectedRows.map(item => item.title).join(','),
      visible: false
    })
    console.log('选择值:', value);
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

ReactDOM.render(<PickerDemo />, container);
```

## API

### props

<table class="table table-bordered table-striped">
    <thead>
      <tr>
        <th style="width: 100px;">name</th>
        <th style="width: 50px;">type</th>
        <th style="width: 50px;">default</th>
        <th>description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>prefixCls</td>
        <td>String</td>
        <td>picker-address</td>
        <td></td>
      </tr>
      <tr>
        <td>className</td>
        <td>String</td>
        <td></td>
        <td>跟节点class</td>
      </tr>
      <tr>
        <td>dataSource</td>
        <td>array</td>
        <td></td>
        <td>数据源</td>
      </tr>
      <tr>
        <td>onClose</td>
        <td>Function</td>
        <td></td>
        <td>关闭时回调函数</td>
      </tr>
      <tr>
        <td>onChange</td>
        <td>Function</td>
        <td></td>
        <td>选择完闭时的回调函数; (value, selectedRows) => {}</td>
      </tr>
      <tr>
        <td>tipText</td>
        <td>string</td>
        <td>请选择</td>
        <td>下一项的提示文字</td>
      </tr>
      <tr>
        <td>value</td>
        <td>array</td>
        <td></td>
        <td>初始值</td>
      </tr>
    </tbody>
</table>

## Development

```
npm install
npm start
```