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

See full changes on commit: [774345f](https://github.com/nishio/tutorial-webworker-with-react/commit/774345ff6fae0d024f8e142583fb4b93f058319e)

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

If you hate `@ts-ignore`, see another solution: "use cast instead of ts-ignore" [1d3c2a4](https://github.com/nishio/tutorial-webworker-with-react/commit/1d3c2a4b4b3d21fa20ce342d1c6eda17dd01e2f4)

## Add button to call webworker

See full changes on commit: [0f5c964](https://github.com/nishio/tutorial-webworker-with-react/commit/0f5c9643cdfa32dbc87dd3b70f465be5af6a2699)

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

**NOTICE**: You don't need to modifiy webpack.config.js if you use inlined `webpack-loader-syntax` as above. I saw several people are confusing about that.

In development environment `npm run start`, it works.
But you may see following error on IDE (for example VSCode): `Cannot find module 'worker-loader!./webworker'.`

The error also occurs in release environment `npm run build`.

To fix the error, you need to add custom type definition.

## Add custom type definition

See full changes on commit: [a9c0c03](https://github.com/nishio/tutorial-webworker-with-react/commit/a9c0c039af66975a2db0545663081cb99b3a5069)

```typescript
declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}
```

If you didn't specify `typeRoots` on tsconfig yet, you also need it. See the commit.

# Appendix

In this tutorial, I create new worker each call.
If you push button before the previous task finishes, the new task runs concurrently.

```typescript
export const runOnWebWorker = (e: any) => {
  status = "running...";
  const worker = new Worker();
  worker.postMessage("heavyTask");
  worker.onmessage = function(event: any) {
    status = "finished";
  };
};
```

If we re-use the worker object like below, the new message waits in queue until the previous task finishes.

```typescript
const worker = new Worker();
worker.onmessage = function(event: any) {
  status = "finished";
};

export const runOnWebWorker = (e: any) => {
  status = "running...";
  worker.postMessage("heavyTask");
};
```
