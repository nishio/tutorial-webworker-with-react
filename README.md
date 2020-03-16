# Tutorial of WebWorker + react-create-app --typescript

## Create React App

[Create React App](https://github.com/facebook/create-react-app).

`$ npx create-react-app tutorial-webworker-with-react --typescript`

## Install worker-loader

`$ cd tutorial-webworker-with-react/`
`$ npm install worker-loader --save-dev`

## Add a heavy task

```
export const heavyTask = (target: string) => {
  console.log("hello,", target);
  const startTime = Date.now();
  while (Date.now() - startTime < 3000) {}
  console.log("bye,", target);
  return 42;
};
```

## See the heavy task blocks UI

## Add webworker

```
import { heavyTask } from "./common";

onmessage = (e: any) => {
  const result = heavyTask("webworker");
  // @ts-ignore
  postMessage(result);
};
```

Unless @ts-ignore, I saw following error:

```
function postMessage(message: any, targetOrigin: string, transfer?: Transferable[] | undefined): void
Expected 2-3 arguments, but got 1.ts(2554)
lib.dom.d.ts(19636, 44): An argument for 'targetOrigin' was not provided.
```

## Add button to call webworker

```
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
...
<button onClick={runOnWebWorker}>on WebWorker</button>
```

It works. But you may see following error: `Cannot find module 'worker-loader!./webworker'.`
To fix it:

## Add custom type definition
