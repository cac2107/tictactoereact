import {useState, useEffect} from "react";
import React from "react";
import Square from './components/Square';
import './App.css'
import ScoreBoard from "./components/ScoreBoard";
import PlayerSelect from "./components/PlayerSelect";

const App = () => {
  const [squares, setSquares] = useState(Array(9).fill(""))
  const [turn, setTurn] = useState('X');
  const [selected, setSelected] = useState(null);
  const [winner, setWinner] = useState(null);
  const [finished, setFinished] = useState(false);
  const [resetBool, setResetBool] = useState(false);
  const [aiScoreBoard, setAiScoreBoard] = useState(Array(3).fill(0));
  const [aiPlayer, setAiPlayer] = useState(null);
  const allSquaresFilled = squares.every((value) => value !== "");

  const handlePlayerSelect = (selectedPlayer) => {
    if(!selected){
      setAiPlayer(selectedPlayer === 'X' ? 'O' : 'X')
      setSelected(selectedPlayer);
    }
  };

  const handleSquareClick = (index) => {
    if(!finished && selected){
      const newSquares = [...squares];
      newSquares[index] = turn;
      setSquares(newSquares);
      setTurn(turn === "X" ? "O" : "X");
    }
  };

  useEffect(() => {
    let winner = checkWinner(squares);
    if((winner || allSquaresFilled) && !finished){
      const newAiScoreBoard = [...aiScoreBoard];
      setWinner(winner);
      setFinished(true);
      if(winner === aiPlayer){
        newAiScoreBoard[0] += 1;
      } else if(winner === (aiPlayer === 'X' ? 'O' : 'X')){
        newAiScoreBoard[1] += 1;
      } else {
        newAiScoreBoard[2] += 1;
      }
      setAiScoreBoard(newAiScoreBoard);
    }
  }, [squares]);

  const checkWinner = (squares) => {
    const combos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let combo of combos) {
        const [a, b, c] = combo;
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return(squares[a]);
        }
    }

    return null;
  };

  const reset = () => {
    setSquares(Array(9).fill(""));
    setSelected(false);
    setResetBool(true);
    setFinished(false);
    setWinner(null);
    setTurn('X');
    setAiPlayer(null);
  }

  const getOpenMoves = (squares) =>{
    return squares.map((square, i) => {
      if(square === "") { return i}
      return null;
    }).filter((square) => square !== null);
  }

  const miniMaxHelper = (squares, depth, turn) => {
    let optimalScore = null;
    const winner = checkWinner(squares);
    if(winner !== null){ return (winner === 'X' ? 1 : -1);}
    else if (squares.every((val) => val !== "")) { return 0; }

    let pMoves = getOpenMoves(squares);
    if(turn === 'X'){ optimalScore = -Infinity; } else { optimalScore = Infinity; }
    pMoves.forEach(move => {
      const newSquares = [...squares];
      newSquares[move] = turn;
      const score = miniMaxHelper(newSquares, depth + 1, turn === 'X' ? 'O' : 'X');
      if (turn === 'X'){
        optimalScore = Math.max(optimalScore, score);
      } else {
        optimalScore = Math.min(optimalScore, score);
      }
    });

    return optimalScore;
  }

  const minimax = (squares) => {
    let bestMove = null;
    let optimalScore = null;
    if(turn === 'X'){ optimalScore = -Infinity; } else { optimalScore = Infinity; }
    let pMoves = getOpenMoves(squares);
    pMoves.forEach(move => {
      const newSquares = [...squares];
      newSquares[move] = turn;
      const score = miniMaxHelper(newSquares, 0, turn === 'X' ? 'O' : 'X');
      if (turn === 'X'){
        if(score > optimalScore){
          optimalScore = score;
          bestMove = move;
        }
      } else {
        if(score < optimalScore){
          optimalScore = score;
          bestMove = move;
        }
      }
    });
    return bestMove;
  }

  useEffect(() => {
    if(turn === aiPlayer && (selected !== null)){
      let move = minimax(squares);
      handleSquareClick(move);
    }
  }, [turn, squares, selected])

  return (
    <div className="app">
      <div className="main-container">
        <p className="current-player">Selected: {selected}</p>
        <p className="current-player">Current Turn: {turn}</p>
        <p id="player-title">Choose Player</p>
        <PlayerSelect onPlayerSelect={handlePlayerSelect}/>
      </div>
      <div className="main-container">
        <div className="title">
          <h1>Tic Tac Toe AI</h1>
        </div>
        <div className="tic-tac-toe-container">
            <div className="tic-tac-toe">
              {squares.map((value, index) => (
                <Square key = {index} turn = {turn} onClick={() => handleSquareClick(index)} finished = {finished} reset = {resetBool} setResetBool = {setResetBool} val = {value} selected = {selected}/>
              ))}
            </div>
          </div>
        {allSquaresFilled || winner ? <h2>Winner: {winner === null ? `Draw!`: winner}</h2> : <h2>Game in progress...</h2>}
        <button id="reset-button" onClick={reset}>Reset</button>
      </div>
      <div className="main-container">
        <ScoreBoard player = "AI Scores" vals = {aiScoreBoard}/>
      </div>
    </div>
    
  );
}

export default App;
