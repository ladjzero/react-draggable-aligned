import React, { Component } from 'react';
import { AlignedDraggable, AlignedMarkingProvider } from 'react-draggable-aligned';

const nodes = [{
  height: 100,
  width: 100,
  color: 'red',
}, {
  height: 120,
  width: 120,
  color: 'blue',
}];

class App extends Component {
  state = {
    positions: [
      { x: 0, y: 0 },
      { x: 200, y: 200 },
    ],
    draggingIndex: NaN,
  }

  getMarkings() {
    const xs = new Set();
    const ys = new Set();
    const { positions, draggingIndex } = this.state;

    xs.add(200);

    switch (draggingIndex) {
      case 0:
        [positions[1].x, positions[1].x + nodes[1].width / 2, positions[1].x + nodes[1].width].forEach(Set.prototype.add.bind(xs));
        [positions[1].y, positions[1].y + nodes[1].height / 2,, positions[1].y + nodes[1].height].forEach(Set.prototype.add.bind(ys));
        break;
      case 1:
        [positions[0].x, positions[0].x + nodes[0].width / 2, positions[0].x + nodes[0].width].forEach(Set.prototype.add.bind(xs));
        [positions[0].y, positions[0].y + nodes[0].height / 2, positions[0].y + nodes[0].height].forEach(Set.prototype.add.bind(ys));
        break;
      default:
        break;
    }

    return { xs: Array.from(xs), ys: Array.from(ys) };
  }

  updatePosition(index, { x, y }) {
    const { positions } = this.state;

    this.setState({
      positions: positions.map((p, i) => i == index ? { x, y } : p),
      draggingIndex: NaN,
    });
  }

  render() {
    const { positions, draggingIndex } = this.state;

    return (
      <AlignedMarkingProvider
        markings={this.getMarkings()}
      >
        <div>
          {
            nodes.map((n, index) => (
              <AlignedDraggable
                key={index}
                position={positions[index]}
                onStart={() => this.setState({ draggingIndex: index })}
                onStop={(e, { x, y }) => this.updatePosition(index, { x, y })}
                width={n.width}
                height={n.height}
                bounds={{ left: 0, top: 0, right: 400 - n.width }}        
              >
                <div className="App" style={{
                  height: n.height,
                  width: n.width,
                  backgroundColor: n.color,
                  position: 'absolute'
                }}>
                </div>
              </AlignedDraggable>
            ))
          }
        </div>
      </AlignedMarkingProvider>
    );
  }
}

export default App;
