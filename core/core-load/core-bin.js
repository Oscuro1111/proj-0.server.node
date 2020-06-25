
const {Interactor} = require('../App/interactor/Handler');

module.exports=(async (loader) => {
  const Modules = (await loader()).get();

  const initializationProceduer = new Promise((resolve, reject) => {
    Modules["createBucket"] = require('../plugins/DB/Bucket/bucket-implementation').getBucket(Modules);
    Modules["DB"] = require("../plugins/DB/DB-Implementation")(Modules); //implementing interface
    
    resolve(new Interactor(Modules));
  })
    .then((_Interactor_) => {
        //server(Mod);
        return _Interactor_;
    })
    .catch((e) => {
    
      throw e;
    });  

    return initializationProceduer;
})(require("../App/pluginLoader/loader"));
