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
    title: PropTypes.node,
  };

  static defaultProps = {
    prefixCls: 'picker-address',
    tipText: '请选择',
    title: '配送至',
  };

  constructor(props) {
    super();
    const { curIdx, selectedRows } = this.getSelectedRows(props);
    this.state = {
      selectedRows,
      curIdx,
      visible: !!props.visible,
    };
  }

  touch = {}

  onTouchStart = (e) => {
    this.touch.startX = e.touches[0].clientX;
    this.touch.startY = e.touches[0].clientY;
    this.touch.moved = false;
  }

  onTouchMove = (e) => {
    const { curIdx, selectedRows } = this.state;
    const moveX = e.touches[0].clientX;
    const moveY = e.touches[0].clientY;
    const deltaX = moveX - this.touch.startX;
    const deltaY = moveY - this.touch.startY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    const curOffsetWidth = -(curIdx * window.innerWidth);
    const maxOffsetWidth = -((selectedRows.length - 1) * window.innerWidth);
    const offsetWidth = Math.min(0, Math.max(maxOffsetWidth, curOffsetWidth + deltaX));
    if (offsetWidth >= 0 || offsetWidth <= maxOffsetWidth) return;
    if (!this.touch.moved) this.touch.moved = true;
    e.preventDefault();

    setTransform(this.refs.wrap.style, `translate3d(${offsetWidth}px, 0, 0)`);

    const percent = Math.abs(deltaX / window.innerWidth);
    this.touch.targetIdx = percent >= 0.1 ? (deltaX < 0) ? curIdx + 1 : curIdx - 1 : curIdx;
  }

  onTouchEnd = () => {
    const { curIdx } = this.state;
    if (!this.touch.moved) return;
    if (this.touch.targetIdx !== curIdx) {
      this.setState({
        curIdx: this.touch.targetIdx,
      });
    }
  }

  bindEvent = () => {
    const wrap = this.refs.wrap;
    wrap.addEventListener('touchstart', this.onTouchStart, false);
    wrap.addEventListener('touchmove', this.onTouchMove, false);
    wrap.addEventListener('touchend', this.onTouchEnd, false);
  }

  unBindEvent = () => {
    const wrap = this.refs.wrap;
    wrap.removeEventListener('touchstart', this.onTouchStart, false);
    wrap.removeEventListener('touchmove', this.onTouchMove, false);
    wrap.removeEventListener('touchend', this.onTouchEnd, false);
  }

  getSelectedRows = ({ value, dataSource }) => {
    const selectedRows = [];
    if (value && dataSource && value.length) {
      const loop = (ds, level) => {
        const v = value[level];
        const rows = ds.filter(item => item.value === v);
        if (rows.length) {
          selectedRows.push(rows[0]);
          if (rows[0].children && rows[0].children.length && value.length === level + 1) {
            selectedRows.push({});
          } else if (rows[0].children && rows[0].children.length) {
            loop(rows[0].children, ++level);
          }
        }
      };
      loop(dataSource, 0);
    }
    if (!selectedRows.length) {
      return {
        curIdx: 0,
        selectedRows: [{}],
      };
    }
    return {
      curIdx: selectedRows.length - 1,
      selectedRows,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible,
    });
  }

  componentDidMount() {
    if (this.state.visible) {
      this.htmlElement.classList.add('noscroll');
    }
    this.bindEvent();
  }

  componentWillUnmount() {
    if (this.htmlElement.classList.contains('noscroll')) {
      this.htmlElement.classList.remove('noscroll');
    }
    this.unBindEvent();
  }

  componentDidUpdate() {
    const { curIdx, visible } = this.state;

    if (!visible) {
      this.htmlElement.classList.remove('noscroll');
    } else {
      if (!this.htmlElement.classList.contains('noscroll')) {
        this.htmlElement.classList.add('noscroll');
      }

      setTransform(this.refs.wrap.style, `translate3d(-${(curIdx) * 100}vw, 0, 0)`);

      const navItem = this.refs.nav.children[curIdx];
      const rect = navItem.getBoundingClientRect();
      this.refs.navline.style.width = `${rect.width}px`;
      this.refs.navline.style.left = `${rect.left}px`;
      this.refs.navline.style.bottom = `${this.refs.nav.clientHeight - (navItem.offsetTop + navItem.offsetHeight)}px`;

      const activeItem = document.querySelector(`.${this.props.prefixCls}-main-nav-item.active`);
      if (activeItem) {
        activeItem.classList.remove('active');
      }
      setTimeout(() => {
        document.querySelector(`#main-nav-item-${curIdx}`).classList.add('active');
      }, 300);
    }
  }

  componentWillUnmount() {
    if (this.state.visible) {
      this.htmlElement.classList.remove('noscroll');
    }
  }

  onClose = (e) => {
    const { onClose, prefixCls } = this.props;

    if (e.target.classList.contains(prefixCls) && onClose) {
      onClose();
    }
  }

  // 异步加载数据
  loadData = () => {

  }

  getNextData = (ds, level = 0) => {
    const { prefixCls } = this.props;
    const { selectedRows } = this.state;
    const row = selectedRows[level] || {};
    const lists = level > 0 ? selectedRows[level - 1].children : ds;

    if (!lists || !lists.length) {
      return null;
    }
    return (
      <div key={level} className={`${prefixCls}-main-body-item`}>
        <ul>
          {lists.map((item) => (
            <li
              key={item.value}
              className={
                cx(`${prefixCls}-main-body-item-li`, { active: row.value === item.value })
              }
              onClick={this.onSelectedRow(item, level)}
            >{item.title}</li>
          ))}
        </ul>
      </div>
    );
  }

  onSelectedRow = (item, level) => () => {
    const { visible, curIdx } = this.state;
    let { selectedRows } = this.state;

    if (selectedRows[level]) {
      const args = [level, 1, item];
      if (item.children && item.children.length && curIdx + 1 >= selectedRows.length) {
        args.push({});
      } else if (curIdx + 1 < selectedRows.length) {
        selectedRows = selectedRows.slice(0, curIdx + 1);
        args.push({});
      }
      selectedRows.splice(...args);

      const isEnd = !item.children || !item.children.length;
      this.setState({
        selectedRows: [...selectedRows],
        curIdx: isEnd ? level : level + 1,
        visible: isEnd ? false : visible,
      });
    }

    if (!item.children || !item.children.length) {
      this.props.onChange(selectedRows.map(_item => _item.value).filter(_item => typeof _item !== 'undefined'), selectedRows);
    }
  }

  onSelectedNav = (item, level) => () => {
    this.setState({
      curIdx: level,
    });
  }

  onNavBarMove = () => {
    this.refs.navline.style.width = 0;
  }

  render() {
    const { selectedRows, visible } = this.state;
    const { className, prefixCls, onClose, dataSource, tipText, title } = this.props;
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
      <div className={classNames} onClick={this.onClose}>
        <div className={`${prefixCls}-main`}>
          <div className={`${prefixCls}-main-title`}>
            <div className={`${prefixCls}-main-title-text`}>{title}</div>
            <div className={`${prefixCls}-main-title-close`} onClick={onClose}></div>
          </div>
          <div className={`${prefixCls}-main-nav`}>
            <ul ref="nav" onTouchMove={this.onNavBarMove}>
              {
                selectedRows.map((item, index) => (
                  item.value
                  ? <li key={index} onClick={this.onSelectedNav(item, index)} id={`main-nav-item-${index}`} className={`${prefixCls}-main-nav-item`}>{item.title}</li>
                  : <li key={index} id={`main-nav-item-${index}`} className={`${prefixCls}-main-nav-item`}>{tipText}</li>
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
