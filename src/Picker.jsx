import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class Picker extends PureComponent {
  htmlElement= document.querySelector('html');
  static propTypes = {
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    visible: PropTypes.bool,
    dataSource: PropTypes.array.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'picker-address',
  };

  componentDidMount() {
    if (this.props.visible) {
      this.htmlElement.classList.add('noscroll');
    }
  }

  componentDidUpdate() {
    if (!this.props.visible) {
      this.htmlElement.classList.remove('noscroll');
    } else {
      this.htmlElement.classList.add('noscroll');
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

  render() {
    const { className, prefixCls, visible, onClose } = this.props;

    const classNames = cx(
      prefixCls,
      className,
      { visible }
    );
    return (
      <div className={classNames} onTouchStart={this.onClose}>
        <div className={`${prefixCls}-main`}>
          <div className={`${prefixCls}-main-title`}>
            <div className={`${prefixCls}-main-title-text`}>配送至</div>
            <div className={`${prefixCls}-main-title-close`} onTouchStart={onClose}></div>
          </div>
          <div className={`${prefixCls}-main-nav`}>
            <ul>
              <li className={`${prefixCls}-main-nav-item`}>黑龙江</li>
              <li className={`${prefixCls}-main-nav-item`}>哈尔滨</li>
            </ul>
            <span className={`${prefixCls}-main-nav-active`}></span>
          </div>
          <div className={`${prefixCls}-main-body clearfix`}>
            <div className={`${prefixCls}-main-body-item`}>
              <ul>
                <li className={`${prefixCls}-main-body-item-li`}>北京</li>
                <li className={`${prefixCls}-main-body-item-li active`}>黑龙江</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
