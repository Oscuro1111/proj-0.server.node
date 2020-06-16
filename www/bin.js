const { createUser } = require("../App/Entity/User");

const { createAuthInfo } = require("../App/Entity/auth");


async function server({ DB }) {
const id= "5ee8ac9c8e19d42ba424d315";

const user =  await DB.findOne({type:"User",id:id});

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
      throw e;
    });  
})(require("../App/pluginLoader/loader"));
