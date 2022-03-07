import React from "react";
import classNames from "classnames";

function Cell(props) {
  let className = classNames("cell", {
    start: props.isStart,
    end: props.isEnd,
    wall: props.isWall,
  });
  return (
    <div
      id={`${props.row},${props.col}`}
      className={className}
      row={props.row}
      col={props.col}
      onMouseEnter={() => {
        props.onMouseEnter({
          row: props.row,
          col: props.col,
        });
      }}
      onClick={() => {
        props.setSelected({
          row: props.row,
          col: props.col,
        });
      }}
    />
  );
}

export default Cell;
