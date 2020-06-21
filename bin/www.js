const { _start } = require("./server-express");
const fs = require('fs');

const run = (async (_) => {
  const coreModule = await require("../core/core-load/core-bin");
 
 // const res=await coreModule.createUser({
   // name:"James",
   // email:"james@gmail.com",
   // pass:"James1999",
  //});
  const id="5eef55231c459816703f9d2e";
  const data = fs.readFileSync("F:/web.projects/node.server/projects/proj-0.server.node/temp/file.text");
  const res =  await coreModule.createPost({
    id:id,
    title:"Closures in javascript",
    fileName:"JamesPage.text",
    fileData:data,
  });

  if(res){
    console.log("User created!");
  }
   return res;
})();

run.then((res) => {
  console.log(res ? "success" : "Error");
});
