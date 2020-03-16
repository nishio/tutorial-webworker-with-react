import React, { useState } from "react";
import "./App.css";
import { heavyTask } from "./common";

// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from "worker-loader!./webworker";

export const runOnWebWorker = (e: any) => {
  status = "running...";
  const worker = new Worker();
  worker.postMessage("heavyTask");
  worker.onmessage = function(event: any) {
    status = "finished";
  };
};

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
        <button onClick={runOnWebWorker}>on WebWorker</button>
        <h1>{status}</h1>
      </header>
    </div>
  );
}

export default App;
