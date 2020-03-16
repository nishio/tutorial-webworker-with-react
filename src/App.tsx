import React, { useState } from "react";
import "./App.css";
import { heavyTask } from "./common";

let status = "";
const runOnUIThread = (e: any) => {
  status = "running...";
  heavyTask("UIThread");
  status = "finished";
};

function App() {
  const [count, setCount] = useState(1);
  setTimeout(() => {
    setCount(count + 1);
  }, 100);
  return (
    <div className="App">
      <header className="App-header">
        <h1>{count}</h1>
        <button onClick={runOnUIThread}>on UI Thread</button>
        <h1>{status}</h1>
      </header>
    </div>
  );
}

export default App;
