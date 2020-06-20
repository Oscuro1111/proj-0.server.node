
module.exports=function Intractor(Modules) {
  this.Modules = Modules;
};

Intractor.prototype = new Object();

const proto = Intractor.prototype;


proto.getPost = async function () {};
proto.getAllPost = async function () {};
proto.createUser = async function () {};
proto.createPost = async function () {};
proto.getLatest = async function () {};
proto.getTrendingPost = async function () {};
proto.searchPost = async function () {};
proto.saveImage = async function () {};
proto.getImage = async function () {};
proto.login = async function () {};
proto.sighUp = async function () {};
