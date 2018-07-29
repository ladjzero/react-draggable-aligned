import React, { Component } from 'react';
import AlignedDraggable from './AlignedDraggable';
import MarkingProvider from './MarkingProvider';

class App extends Component {
  state = {
    positions: [
      { x: 0, y: 0 },
      { x: 200, y: 200 },
    ],
    draggingIndex: NaN,
  }

  render() {
    const { positions, draggingIndex } = this.state;

    return (
      <MarkingProvider
        markings={() => positions.filter((_, i) => i != draggingIndex).map(({x ,y })=> ({ x: x+ 50, y: y+50}))}
        // markings={[{ x: 100, y: 100 }]}
      >
      <AlignedDraggable position={positions[0]}
        onStart={() => this.setState({ draggingIndex: 0 })}
        onStop={(e, { x, y }) => this.setState({ positions: [{ x, y }, positions[1]], draggingIndex: NaN})}
      >
        <div className="App" style={{
          height: 100,
          width: 100,
          backgroundColor: 'red',
          position: 'absolute'
        }}>
        </div>
      </AlignedDraggable>
      <AlignedDraggable position={positions[1]}
        onStart={() => this.setState({ draggingIndex: 1 })}
        onStop={(e, { x, y }) => this.setState({ positions: [positions[0], { x, y }], draggingIndex: NaN })}      
      >
        <div className="App" style={{
          height: 100,
          width: 100,
          backgroundColor: 'green',
          position: 'absolute'
        }}>
        </div>
      </AlignedDraggable>
      </MarkingProvider>
    );
  }
}

export default App;
