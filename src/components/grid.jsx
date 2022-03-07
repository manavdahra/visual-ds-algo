import React, { useState } from "react";
import Row from "./row";
import Cell from "./cell";
import djikstra from "../algorithms/dijkstra";

function Grid(props) {
  const R = props.rows;
  const C = props.cols;
  const delayFactor = 5;
  const getInitalCellStates = () => {
    let cellStates = {};
    for (let i = 0; i < R; i++) {
      cellStates[i] = {};
      for (let j = 0; j < C; j++) {
        cellStates[i][j] = { isWall: false };
      }
    }
    return cellStates;
  };
  const [searching, setSearching] = useState(false);
  const [selector, setSelector] = useState("start");
  const [cellStates, setCellStates] = useState(getInitalCellStates());
  const [startAndEnd, setStartAndEnd] = useState({});
  const [mouseDown, setMouseDown] = useState(false);

  const findPath = () => {
    const { visited, path } = djikstra(cellStates, startAndEnd);
    let from = startAndEnd.end;
    let to = startAndEnd.start;
    let srcToDst = [];
    while (from.row !== to.row || from.col !== to.col) {
      from = path[from.row][from.col];
      if (
        !from ||
        (!from.row && from.row !== 0) ||
        (!from.col && from.col !== 0)
      )
        break;
      if (!to || (!to.row && to.row !== 0) || (!to.col && to.col !== 0)) break;
      if (from.row === to.row && from.col === to.col) break;
      srcToDst.unshift(from);
    }

    const promise = new Promise((resolve, reject) => {
      for (let index = 0; index < visited.length; index++) {
        let elem = document.getElementById(
          `${visited[index].row},${visited[index].col}`
        );
        if (elem.classList.contains("end")) {
          continue;
        }

        ((delay, elem, count) => {
          setTimeout(() => {
            elem.classList.add("visited");
            if (count === visited.length - 1) {
              resolve();
            }
          }, delay);
        })(delayFactor * index, elem, index);
      }
      setTimeout(() => {
        resolve();
      }, 2500);
    });
    promise.then(() => {
      for (let index = 0; index < srcToDst.length; index++) {
        let step = srcToDst[index];
        let elem = document.getElementById(`${step.row},${step.col}`);
        if (elem.classList.contains("end")) {
          continue;
        }
        ((delay, elem) => {
          setTimeout(() => {
            elem.classList.add("step");
          }, delay);
        })(10 * delayFactor * index, elem);
      }
    });
  };

  const nodeTypes = () => {
    return (
      <select
        value={selector}
        className="input-select"
        onChange={(ev) => {
          setSelector(ev.target.value);
        }}
      >
        <option value="start">Start Node</option>
        <option value="end">End Node</option>
        <option value="wall">Wall</option>
      </select>
    );
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
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        document.getElementById(`${i},${j}`).classList.remove("visited");
        document.getElementById(`${i},${j}`).classList.remove("step");
      }
    }
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
        {nodeTypes()}
        <button
          className="button-find-path"
          disabled={!startAndEnd.start || !startAndEnd.end || searching}
          onClick={findPath}
        >
          Find path
        </button>
        <button className="button-reset" disabled={searching} onClick={reset}>
          Reset
        </button>
      </div>
    </>
  );
}

export default Grid;
