
const { createUser } = require("../App/Entity/User");
const {createPost}  = require('../App/Entity/post');
const { createAuthInfo } = require("../App/Entity/auth");
const fs = require('fs');
const log = console.log; 


module.exports=(async (loader) => {
  const Modules = (await loader()).get();

  const initializationProceduer = new Promise((resolve, reject) => {
    Modules["createBucket"] = require('../plugins/DB/Bucket/bucket-implementation').getBucket(Modules);
    Modules["DB"] = require("../plugins/DB/DB-Implementation")(Modules); //implementing interface

    resolve(Modules);
  })
    .then((Mod) => {
        //server(Mod);
        return Mod;
    })
    .catch((e) => {
      delete initializationProceduer;
      throw e;
    });  

    return initializationProceduer;
})(require("../App/pluginLoader/loader"));
