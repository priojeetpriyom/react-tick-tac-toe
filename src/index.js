import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button 
        className="square" 
        onClick={() => {props.onClick()}}
        >
        {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => {this.props.onClick(i)}}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    const squares = Array(9).fill(null);
    this.props = props;
    this.state = {
      history : [{squares : squares}],
      isXCurrentPlayer : true
    }

    this.handleClick.bind(this);
  }

  handleClick(pos) {
    const squares = this.state.history.slice().pop().squares.slice();

    if(squares[pos] || calculateWinner(squares)) {
      return;
    }

    squares[pos] = (this.state.isXCurrentPlayer == true ? "X" : "O");
    this.setState({
      history : this.state.history.concat({squares : squares}),
      isXCurrentPlayer : !this.state.isXCurrentPlayer
    });
    console.log(squares);
  }

  jumpTo(stepNumber) {
    const history = this.state.history;
    this.setState({
      history : history.slice(0, stepNumber + 1),
      isXCurrentPlayer : stepNumber % 2 == 0
    }); 
  }

  render() {
    let status;
    const winner = calculateWinner(this.state.history.slice().pop().squares);
    const moves = this.state.history.map((currentHistory, stepNumber) => {
      let desc = !stepNumber? "Go to Start" : "Go to move #" + stepNumber;
      
      return (
        <li>
          <button onClick = {() => this.jumpTo(stepNumber)}>{desc}</button>
        </li>
      );
    });

    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.props.isXCurrentPlayer ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={this.state.history.slice().pop().squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
