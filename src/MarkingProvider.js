import React from 'react';
import PropTypes from 'prop-types';

export default class MarkingProvider extends React.Component {
  state = {
    alignX: NaN,
    alignY: NaN,
  }

  static childContextTypes = {
    markings: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
    shouldAlign: PropTypes.func,
  }

  shouldAlign = ({ x, y }) => {
    const markings = typeof this.props.markings == 'function' ? this.props.markings() : this.props.markings;
    let newX = x, newY = y;
    let deltaX = Infinity, deltaY = Infinity;

    markings.forEach(m => {
      if (m.x) {
        const dltx = Math.abs(m.x - newX);

        if (dltx < deltaX && dltx < 20) {
          deltaX = dltx;
          newX = m.x;
        }
      }

      if (m.y) {
        const dlty = Math.abs(m.y - newY);

        if (dlty < deltaY && dlty < 20) {
          deltaY = dlty;
          newY = m.y;
        }
      }
    });

    if (x == newX && y == newY) {
      this.setState({ alignX: NaN, alignY: NaN });
      return null;
    } else if (x != newX && y != newY) {
      this.setState({ alignX: newX, alignY: newY });
      return { x: newX, y: newY };
    } else if (x != newX && y == newY) {
      this.setState({ alignX: newX, alignY: NaN });
      return { x: newX, y: newY };
    } else {
      this.setState({ alignX: NaN, alignY: newY });
      return { x: newX, y: newY };
    }
  }

  render() {
    const { alignX, alignY } = this.state;

    return (
      <div>
        {this.props.children}
    { !!alignX && <div style={{
      position: 'fixed',
      width: 1,
      height: '100%',
      left: alignX,
      top: 0,
      backgroundColor: 'black'
    }}></div> }
    { !!alignY && <div style={{
      position: 'fixed',
      height: 1,
      width: '100%',
      left: 0,
      top: alignY,
      backgroundColor: 'black'
    }}></div> }
      </div>
    );
  }

  getChildContext() {
    return {
      markings: this.props.markings,
      shouldAlign: this.shouldAlign,
    };
  }
}