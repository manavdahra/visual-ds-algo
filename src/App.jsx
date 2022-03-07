import React from "react";
import Grid from "./components/grid";
import "./App.css";

const R = 20;
const C = 50;

function App() {
  return (
    <div className="app">
      <Grid rows={R} cols={C}></Grid>
    </div>
  );
}

export default App;
