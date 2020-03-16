import { heavyTask } from "./common";

onmessage = (e: any) => {
  const result = heavyTask("webworker");
  // @ts-ignore
  postMessage(result);
};
