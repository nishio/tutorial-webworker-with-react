import { heavyTask } from "./common";

onmessage = (e: any) => {
  const result = heavyTask("webworker");
  const postMessageOnWorker = postMessage as (message: any) => void;
  postMessageOnWorker(result);
};
