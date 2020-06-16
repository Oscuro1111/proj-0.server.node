/*
  Author:Oscuro Smith
*/
/*Loader:
 clean  Loader for loading async modules before the server initalize make dependices injection easy.
*/
const { asyncModules_, staticModules_ } = require("../../plugins/plugins-meta");


async function* asyncModules(modules, name) {
  var i = 0;

  for (; i < modules.length; i++) {
    
    name.moduleName = modules[i].split('/')[0];

    yield require("../../plugins/" + modules[i]);
  }
}

module.exports = async (_) => {
  const __Modules__ = {};
  const name = { moduleName: null };

  //async modules of plugins
  if (asyncModules_.length > 0) {
    for await (const module of asyncModules(asyncModules_, name)) {
      __Modules__[name.moduleName] = module;
    }
  }

  if (staticModules_.length > 0) {
    for (let i = 0 ;i<staticModules_.length;i++) {
         __Modules__[staticModules_[i].split('/')[0]] = require("../../plugins/"+staticModules_[i]); 
    }
  }
  
  return { get: () => __Modules__ ,asyncModules_,staticModules_};
};
