const { createUser } = require("../App/Entity/User");

const { createAuthInfo } = require("../App/Entity/auth");

const log = console.log;
async function server({ DB }) {

  const id= "5eea25ea2791932414f5932b";

  const user =await DB.findOne({type:"User",id:id});



  user.auth=null;
 const res= await DB.update(user);

  if(res.err){
    log("ERROR during updated!");
  }else{
    log("Sucessfully updated!");
  }

}

(async (loader) => {
  const Modules = (await loader()).get();

  const initializationProceduer = new Promise((resolve, reject) => {
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
