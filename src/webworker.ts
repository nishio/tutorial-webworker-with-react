import { heavyTask } from "./common";

onmessage = (e: any) => {
  console.log(e.data.scale(3));
  const result = heavyTask("webworker");
  const postMessageOnWorker = postMessage as (message: any) => void;
  postMessageOnWorker(result);
};
