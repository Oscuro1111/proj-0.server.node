const { _start } = require("./server-express");
const fs = require('fs');

async function createUser(coreModule){

  
  const res=await coreModule.createUser({
     name:"Oscuro",
     email:"Oscuro@gmail.com",
      pass:"Oscuro1999",
  });         
  return res;
}


async function createPost(coreModule,id){
  
  const data = fs.readFileSync("F:/web.projects/node.server/projects/proj-0.server.node/temp/file.text");
  const res =  await coreModule.createPost({
    id:id,
    title:"Closures in javascript",
    fileName:"oscuro.text",
    fileData:data,
  });
  

  return res;
} 


async function getPost(coreModule,id){

 
  const res =  await coreModule.getPostData(id);
  const path="F:/web.projects/node.server/projects/proj-0.server.node/temp/"

  if(res){
    const {fileData,fileName} = res;
    

    fs.writeFileSync(path+`${fileName}`,fileData,'utf8');
  }
return res;
}
const run = (async (_) => {
  const coreModule = await require("../core/core-load/core-bin");
 
 // const uid =    await createUser(coreModule);
  // const postid = await createPost(coreModule,uid);
   //const res =    await getPost(coreModule,postid);
  

  //const res = await coreModule.getLatestPosts();
   const res = await  coreModule.searchPost("of in the exe");
  console.log(res);
  if(res){
    console.log("User created!");
  }
   return res;
})();

run.then((res) => {
  console.log(res ? "success" : "Error");
});
