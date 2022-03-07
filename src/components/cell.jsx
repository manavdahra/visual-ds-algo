import React from "react";
import classNames from "classnames";

function Cell(props) {
  let className = classNames("cell", {
    start: props.isStart,
    end: props.isEnd,
    wall: props.isWall,
    visited: props.isVisited && !props.isStart && !props.isEnd && !props.isWall,
  });
  return (
    <div
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
