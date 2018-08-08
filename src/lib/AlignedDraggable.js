import React, { PureComponent } from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

/**
 * hacked Draggable
 */
class _AlignedDraggable extends Draggable {
  constructor(props) {
    super(props);

    this._setState = this.setState;

    this.setState = (nextState) => {
      const { x, y } = nextState;
      let _x = NaN;
      let _y = NaN;
      let markingX = NaN;
      let markingY = NaN;

      if (x >= 0 && y >= 0) {
        const newXY = props.shouldAlign({ x, y });

        if (newXY) {
          _x = newXY.x;
          _y = newXY.y;
          markingX = newXY.markingX;
          markingY = newXY.markingY;
        }
      }

      this._setState({ ...nextState, _x, _y, markingX, markingY });
    };

    this._onDrag = this.onDrag;
    this.onDrag = (e, coreData) => {
      e._x = this.state._x;
      e._y = this.state._y;
      e.markingX = this.state.markingX;
      e.markingY = this.state.markingY;
      this._onDrag(e, coreData);
    };

    this._onDragStop = this.onDragStop;
    this.onDragStop = (e, coreData) => {
      const { _x, _y } = this.state;
      e._x = _x;
      e._y = _y;
      e.markingX = this.state.markingX;
      e.markingY = this.state.markingY;
      this._onDragStop(e, coreData);

      if (_x >= 0 && _y >= 0) {
        this._setState({ x: _x, y: _y, _x: NaN, _y: NaN });
      } else if (_x >= 0) {
        this._setState({ x: _x, _x: NaN, _y: NaN });        
      } else if (_y >= 0) {
        this._setState({ y: _y, _x: NaN, _y: NaN });        
      } else {
        this._setState({ _x: NaN, _y: NaN });        
      }
    };
  }

  render() {
    const { x, y, _x, _y } = this.state;

    if (_x >= 0) {
      this.state.x = _x;
    }

    if (_y >= 0) {
      this.state.y = _y;
    }

    const el = super.render();

    this.state.x = x;
    this.state.y = y;

    return el;
  }
}

function snap(marking, wh, index) {
  switch (index) {
  // start
  case 0:
    return marking;
    break;
  // middle
  case 1:
    return marking - wh / 2;
    break;
  // end
  default:
    return marking - wh;
  }
}

export default class AlignedDraggable extends PureComponent {
  static contextTypes = {
    onAligned: PropTypes.func,
    threshold: PropTypes.number,
    markings: PropTypes.array,
  }

  shouldAlign = ({ x, y }) => {
    const threshold = this.context.threshold;
    const m = this.context.markings;
    const xs = [x];
    const ys = [y];
    const { width, height } = this.props;

    if (width > 0) {
      xs.push(x + width / 2, x + width);
    }

    if (height > 0) {
      ys.push(y + height / 2, y + height);
    }

    let markingX;
    let markingY;
    let deltax = Infinity;
    let deltay = Infinity;
    let xi = 0;
    let yi = 0;

    if (m.xs && m.xs.length) {
      for (let i = 0; i < m.xs.length; i++) {
        for (let j = 0; j < xs.length; j++) {
          const dltx = Math.abs(m.xs[i] - xs[j]);
  
          if (dltx < threshold && dltx < deltax) {
            deltax = dltx;
            markingX = m.xs[i];
            xi = j;
          }
        }
      }
    }

    if (m.ys && m.ys.length) {
      for (let i = 0; i < m.ys.length; i++) {
        for (let j = 0; j < ys.length; j++) {
          const dlty = Math.abs(m.ys[i] - ys[j]);
  
          if (dlty < threshold && dlty < deltay) {
            deltay = dlty;
            markingY = m.ys[i];
            yi = j;
          }
        }
      }
    }

    let ret;

    if (markingX >= 0 && markingY >= 0) {
      ret = {
        x: snap(markingX, width, xi),
        y: snap(markingY, height, yi),
        markingX,
        markingY,
      };
    } else if (markingX >= 0) {
      ret = {
        x: snap(markingX, width, xi),
        y,
        markingX,
      };
    } else if (markingY >= 0) {
      ret = {
        x,
        y: snap(markingY, height, yi),
        markingY,
      };
    } else {
      ret = { x, y };
    }

    return (ret);
  }

  onDrag = (e, uiData) => {
    this.context.onAligned({ x: e.markingX, y: e.markingY });

    if (this.props.onDrag) {
      const { _x, _y } = e;

      if (_x >= 0) {
        uiData.x = _x;
      }

      if (_y >= 0) {
        uiData.y = _y;
      }
      
      /* eslint consistent-return: 0*/
      return this.props.onDrag(e, uiData);
    }
  }

  onStop = (e, uiData) => {
    this.context.onAligned({ x: NaN, y: NaN });

    if (this.props.onStop) {
      const { _x, _y } = e;

      if (_x >= 0) {
        uiData.x = _x;
      }

      if (_y >= 0) {
        uiData.y = _y;
      }

      /* eslint consistent-return: 0*/
      return this.props.onStop(e, uiData);
    }
  }

  render() {
    return React.createElement(
      _AlignedDraggable,
      {
        ...this.props,
        onDrag: this.onDrag,
        onStop: this.onStop,
        shouldAlign: this.shouldAlign,
      }
    );
  }
}