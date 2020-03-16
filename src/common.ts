export const heavyTask = (target: string) => {
  console.log("hello,", target);
  const startTime = Date.now();
  while (Date.now() - startTime < 3000) {}
  console.log("bye,", target);
  return 42;
};
