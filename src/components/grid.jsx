import React, { useState, useEffect } from "react";
import Row from "./row";
import Cell from "./cell";
import djikstra from "../algorithms/dijkstra";

function Grid(props) {
  const R = props.rows;
  const C = props.cols;
  const getInitalCellStates = () => {
    let cellStates = {};
    for (let i = 0; i < R; i++) {
      cellStates[i] = {};
      for (let j = 0; j < C; j++) {
        cellStates[i][j] = { isVisited: false, isWall: false };
      }
    }
    return cellStates;
  };
  const [searching, setSearching] = useState(false);
  const [selector, setSelector] = useState("start");
  const [cellStates, setCellStates] = useState(getInitalCellStates());
  const [visited, setVisited] = useState({});
  const [startAndEnd, setStartAndEnd] = useState({});
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    if (
      visited &&
      (visited.row || visited.row == 0) &&
      (visited.col || visited.col == 0) &&
      cellStates
    ) {
      cellStates[visited.row][visited.col].isVisited = true;
      setCellStates({ ...cellStates });
    }
  }, [visited]);

  const findPath = () => {
    djikstra(cellStates, startAndEnd, (visited) => {
      setTimeout(() => {
        setVisited(visited);
        setSearching(true);
      }, 0);
    });
    setSearching(false);
  };

  const rows = (cellStates) => {
    const rows = [];
    for (let i = 0; i < R; i++) {
      const cells = [];
      for (let j = 0; j < C; j++) {
        cells.push(
          <Cell
            key={`${i},${j}`}
            row={i}
            col={j}
            isVisited={cellStates[i][j].isVisited}
            isWall={cellStates[i][j].isWall}
            isStart={
              startAndEnd.start &&
              startAndEnd.start.row === i &&
              startAndEnd.start.col === j
            }
            isEnd={
              startAndEnd.end &&
              startAndEnd.end.row === i &&
              startAndEnd.end.col === j
            }
            onMouseEnter={(cellCoord) => {
              if (mouseDown && selector === "wall") {
                cellStates[cellCoord.row][cellCoord.col] = {
                  row: cellCoord.row,
                  col: cellCoord.col,
                  isVisited: false,
                  isWall: true,
                };
                setCellStates({ ...cellStates });
              }
            }}
            setSelected={(selected) => {
              let _startAndEnd = { ...startAndEnd };
              switch (selector) {
                case "end":
                  if (
                    _startAndEnd.end &&
                    _startAndEnd.end.row === selected.row &&
                    _startAndEnd.end.col === selected.col
                  ) {
                    _startAndEnd.end = null;
                  } else {
                    _startAndEnd.end = selected;
                  }
                  setStartAndEnd(_startAndEnd);
                  break;
                case "wall":
                  let isWall = cellStates[selected.row][selected.col].isWall;
                  cellStates[selected.row][selected.col].isWall = !isWall;
                  cellStates[selected.row][selected.col].isVisited = false;
                  break;
                default:
                  if (
                    _startAndEnd.start &&
                    _startAndEnd.start.row === selected.row &&
                    _startAndEnd.start.col === selected.col
                  ) {
                    _startAndEnd.start = null;
                  } else {
                    _startAndEnd.start = selected;
                  }
                  setStartAndEnd(_startAndEnd);
                  break;
              }
              setCellStates({ ...cellStates });
            }}
          ></Cell>
        );
      }
      rows.push(<Row key={i} cells={cells}></Row>);
    }
    return rows;
  };

  const reset = () => {
    setSearching(false);
    setSelector("start");
    setCellStates(getInitalCellStates());
    setStartAndEnd({});
  };
  return (
    <>
      <div
        className="grid"
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
      >
        {rows(cellStates)}
      </div>
      <div>
        <button
          className="button"
          onClick={() => {
            setSelector("start");
          }}
        >
          Start
        </button>
        <button
          className="button"
          onClick={() => {
            setSelector("end");
          }}
        >
          End
        </button>
        <button
          className="button"
          onClick={() => {
            setSelector("wall");
          }}
        >
          Wall
        </button>
        <button
          className="button"
          disabled={!startAndEnd.start || !startAndEnd.end || searching}
          onClick={findPath}
        >
          Find path!
        </button>
        <button className="button" disabled={searching} onClick={reset}>
          Reset
        </button>
      </div>
    </>
  );
}

export default Grid;
