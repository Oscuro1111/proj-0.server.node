const { createUser } = require("../App/Entity/User");
const {createPost}  = require('../App/Entity/post');
const { createAuthInfo } = require("../App/Entity/auth");
const fs = require('fs');
const log = console.log; 

async function server({ DB,createBucket }) {
  
  const bucket = createBucket();
  const id= "5eea25ea2791932414f5932b";
  const user =await DB.findOne({type:"User",id:id});
   const post = await DB.findOne({type:"Post",id:user.post[0]});
   const {data,err} = await bucket.downloadFile(post.fileId);

  if(err){
     log("Error arised during download operation!");
    return;
  }
  fs.writeFileSync("F:/web.projects/node.server/projects/proj-0.server.node/temp/"+`${post.fileName}`,data,'utf8');

  log("Done");
  /*
  const data = fs.readFileSync("F:/web.projects/node.server/projects/proj-0.server.node/temp/file.text"); //does not accept relative path
  
  
  const fileId= await bucket.uploadFile({name:"test.text",data:data});

  if(!fileId.status){

    log("Error during uploading file-"+`${"test.text"}!`);
    return ;
  }else{
    log("File uploaded successfully!");
  }
  const post = createPost({
    title:"Test file",
    author:"Oscuro smith",
    fileName:"test.text" ,
    fileId:fileId.uploadId,
  });

  await DB.save(post);

  user.posts=[];
  user.posts.push(post._id);

  const res= await DB.update(user);
   
  if(res.err){
    log("ERROR during updated!");
  }else{
    log("Sucessfully updated!");
  }*/
}

(async (loader) => {
  const Modules = (await loader()).get();

  const initializationProceduer = new Promise((resolve, reject) => {
    Modules["createBucket"] = require('../plugins/DB/Bucket/bucket-implementation').getBucket(Modules);
    Modules["DB"] = require("../plugins/DB/DB-Implementation")(Modules); //implementing interface
    resolve(Modules);
  })
    .then((Mod) => {
        server(Mod);
    })
    .catch((e) => {
      delete initializationProceduer;
      throw e;
    });  
})(require("../App/pluginLoader/loader"));
