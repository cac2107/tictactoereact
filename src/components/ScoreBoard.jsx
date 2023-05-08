import React from "react";

const ScoreBoard = ({player, vals}) => {
  return (
    <div className="scoreboard">
      <div>{player}</div>
      <div className="scoreboard-container">
        <p>Wins: {vals[0]}</p>
        <p>Losses: {vals[1]}</p>
        <p>Draws: {vals[2]}</p>
      </div>
    </div>
  )
}

export default ScoreBoard;