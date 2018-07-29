import React from 'react';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';

class _AlignDraggable extends Draggable {
  constructor(props) {
    super(props);

    this._onDragStop = this.onDragStop;

    this.onDragStop = (e, coreData) => {
      this._onDragStop(e, coreData);
      const { shouldAlign } = this.props;
      const newState = shouldAlign && shouldAlign(this.state);

      if (newState) {
        this.setState(newState);
      }
    }
  }

  render() {
    const { x, y } = this.state;
    const { shouldAlign } = this.props;

    this.alignedTo = shouldAlign && shouldAlign({ x, y });

    if (this.alignedTo) {
      this.state.x = this.alignedTo.x;
      this.state.y = this.alignedTo.y;
    }

    const el = super.render();

    this.state.x = x;
    this.state.y = y;

    return el;
  }
};

export default class AlignDraggable extends React.Component {
  static contextTypes = {
    shouldAlign: PropTypes.func
  }

  shouldComponentUpdate(nextProps) {
    return this.props != nextProps;
  }

  render() {
    const props = this.props;

    const shouldAlign = this.context.shouldAlign;

    if (shouldAlign) {
      const newProps = { ...props };
      const onDrag = newProps.onDrag;
      const onStop = newProps.onStop;
  
      if (onDrag) {
        newProps.onDrag = (e, uiData) => {
          const newState = shouldAlign(uiData);
          if (newState) {
            return onDrag(e, { ...uiData, ...newState });
          } else {
            return onDrag(e, uiData);
          }
        }
      }
  
      if (onStop) {
        newProps.onStop = (e, uiData) => {
          const newState = shouldAlign(uiData);
  
          if (newState) {
            return onStop(e, { ...uiData, ...newState });
          } else {
            return onStop(e, uiData);
          }
        }
      }
  
      return React.createElement(_AlignDraggable, { ...newProps, shouldAlign });
    } else {
      return React.createElement(_AlignDraggable, { ...props, shouldAlign });
    }
  }
}