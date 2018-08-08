import React from 'react';
import PropTypes from 'prop-types';

export default class AlignedMarkingProvider extends React.Component {
  static childContextTypes = {
    markings: PropTypes.array,
    onAligned: PropTypes.func,
    threshold: PropTypes.number,
  }

  getChildContext() {
    return {
      markings: this.props.markings,
      onAligned: this.onAligned,
      threshold: this.props.threshold || 8,
    };
  }

  state = {
    x: NaN,
    y: NaN,
  }

  onAligned = ({ x, y }) => {
    this.setState({ x, y });
    this.props.onAligned && this.props.onAligned({ x, y });
  }

  render() {
    React.Children.only(this.props.children);
    const { x, y } = this.state;

    return React.cloneElement(
      this.props.children,
      {},
      [
        this.props.children.props.children,
        x > 0 && (
          <div
            key="x"
            style={{
              position: 'fixed',
              width: 1,
              height: '100%',
              left: x,
              top: 0,
              backgroundColor: '#00ffe8',
            }}
          />
        ),
        y > 0 && (
          <div
            key="y"
            style={{
              position: 'fixed',
              height: 1,
              width: '100%',
              left: 0,
              top: y,
              backgroundColor: '#00ffe8'
            }}
          />
        )
      ].filter(Boolean),
    );
  }
}