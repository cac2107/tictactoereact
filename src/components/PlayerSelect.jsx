import React from "react";

const PlayerSelect = ({ onPlayerSelect }) => {
  const handleButtonClick = (event) => {
    const selectedPlayer = event.target.innerHTML;
    onPlayerSelect(selectedPlayer);
  };

  return (

    <div id="playerselect">
      <button className="playerbutton" onClick={handleButtonClick}>X</button>
      <button className="playerbutton" onClick={handleButtonClick}>O</button>
    </div>
  )
}

export default PlayerSelect;