import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { setTransform } from './utils';

export default class Picker extends PureComponent {
  htmlElement= document.querySelector('html');
  static propTypes = {
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    visible: PropTypes.bool,
    dataSource: PropTypes.array.isRequired,
    onClose: PropTypes.func,
    tipText: PropTypes.string,
    value: PropTypes.array,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'picker-address',
    tipText: '请选择',
    value: [],
  };

  state = {
    selectedRows: [{}],
    curIdx: 0
  }

  componentDidMount() {
    if (this.props.visible) {
      this.htmlElement.classList.add('noscroll');
    }
  }

  componentDidUpdate() {
    if (!this.props.visible) {
      this.htmlElement.classList.remove('noscroll');
    } else {
      if (!this.htmlElement.classList.contains('noscroll')) {
        this.htmlElement.classList.add('noscroll');
      }

      const { selectedRows, curIdx } = this.state;
      setTransform(this.refs.wrap.style, `translate3d(${(1 - selectedRows.length) * 100}vw, 0, 0)`);

      const rect = this.refs.nav.children[curIdx].getBoundingClientRect();
      this.refs.navline.style.width = `${rect.width}px`;
      this.refs.navline.style.left = `${rect.left}px`;
      this.refs.navline.style.bottom = `${this.refs.nav.clientHeight - (this.refs.nav.children[curIdx].offsetTop + 33)}px`;
    }
  }

  componentWillUnmount() {
    if (this.props.visible) {
      this.htmlElement.classList.remove('noscroll');
    }
  }

  onClose = (e) => {
    const { onClose, prefixCls } = this.props;

    if (e.target.classList.contains(prefixCls) && onClose) {
      onClose();
    }
  }

  loadData = () => {

  }

  getNextData = (ds, level = 0) => {
    const { prefixCls } = this.props;
    const { selectedRows } = this.state;
    const row = selectedRows[level] || {};

    return (
      <div key={level} className={`${prefixCls}-main-body-item`}>
        <ul>
          {ds.map((item) => (
            <li
              key={item.value}
              className={
                cx(`${prefixCls}-main-body-item-li`, { active: row.value === item.value })
              }
              onTouchEnd={this.onSelectedRow(item, level)}
            >{item.title}</li>
          ))}
        </ul>
      </div>
    );
  }

  onSelectedRow = (item, level) => () => {
    const { selectedRows } = this.state;
    if (selectedRows[level] && !selectedRows[level].value) {
      selectedRows.splice(level, 1, item, {});
      this.setState({
        selectedRows: [...selectedRows],
        curIdx: level + 1,
      });
    } else {
      return;
    }
  }

  onSelectedNav = (item, level) => () => {
    this.setState({
      curIdx: level,
    });
  }

  render() {
    const { selectedRows } = this.state;
    const { className, prefixCls, visible, onClose, dataSource, tipText } = this.props;
    const classNames = cx(
      prefixCls,
      className,
      { visible }
    );
    const wrapStyles = {
      width: `${selectedRows.length * 100}vw`,
    };
    
    if (selectedRows.length === 1) {
      wrapStyles.transform = 'translate3d(0, 0, 0)';
    }

    return (
      <div className={classNames} onTouchStart={this.onClose}>
        <div className={`${prefixCls}-main`}>
          <div className={`${prefixCls}-main-title`}>
            <div className={`${prefixCls}-main-title-text`}>配送至</div>
            <div className={`${prefixCls}-main-title-close`} onTouchStart={onClose}></div>
          </div>
          <div className={`${prefixCls}-main-nav`}>
            <ul ref="nav">
              {
                selectedRows.map((item, index) => (
                  item.value
                  ? <li key={index} onTouchEnd={this.onSelectedNav(item, index)} className={`${prefixCls}-main-nav-item`}>{item.title}</li>
                  : <li key={index} className={`${prefixCls}-main-nav-item`}>{tipText}</li>
                ))
              }
            </ul>
            <span className={`${prefixCls}-main-nav-active`} ref="navline"></span>
          </div>
          <div className={`${prefixCls}-main-body`}>
            <div className="wrap" ref="wrap" style={wrapStyles}>
              {
                selectedRows.map((item, index) => this.getNextData(dataSource, index))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
