const { _start } = require("./server-express");

const run = (async (_) => {
  
  const coreModule = await require("../core/core-load/core-bin");
  
  _start(coreModule);
  return true;
})();

run.then((res) => {
  console.log(res ? "success" : "Error");
});
