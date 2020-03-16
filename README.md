# Tutorial of WebWorker + react-create-app --typescript

## Create React App

`$ npx create-react-app tutorial-webworker-with-react --typescript`

## Install worker-loader

```
$ cd tutorial-webworker-with-react/
$ npm install worker-loader --save-dev
```

## Add a heavy task

```typescript
export const heavyTask = (target: string) => {
  console.log("hello,", target);
  const startTime = Date.now();
  while (Date.now() - startTime < 3000) {}
  console.log("bye,", target);
  return 42;
};
```

## See the heavy task blocks UI

See full changes on commit: 774345ff6fae0d024f8e142583fb4b93f058319e

```typescript
const runOnUIThread = (e: any) => {
  status = "running...";
  heavyTask("UIThread");
  status = "finished";
};
...
<button onClick={runOnUIThread}>on UI Thread</button>
```

## Add webworker

```typescript
import { heavyTask } from "./common";

onmessage = (e: any) => {
  const result = heavyTask("webworker");
  // @ts-ignore
  postMessage(result);
};
```

Unless @ts-ignore, I saw following transpile error:

```
function postMessage(message: any, targetOrigin: string, transfer?: Transferable[] | undefined): void
Expected 2-3 arguments, but got 1.ts(2554)
lib.dom.d.ts(19636, 44): An argument for 'targetOrigin' was not provided.
```

However, adding second argument such as `postMessage(result, "*")` causes following runtime error:

```
Uncaught TypeError: Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': 
No function was found that matched the signature provided.
```

## Add button to call webworker

```typescript
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

See full changes on commit: a9c0c039af66975a2db0545663081cb99b3a5069

```typescript
declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}
```
