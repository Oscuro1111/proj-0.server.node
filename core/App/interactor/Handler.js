/**
 * Author:Oscuro Smith
 * Inaterator for executing core login for application
 * 
 */

function Interactor(Modules) {
  this.name="Interactor";
  this.Modules = Modules;
};

Interactor.prototype = new Object();

const proto = Interactor.prototype;


proto.createPost = async function (data) {
  
  const {DB,createBucket} = this.Modules;
  const {
    id,
    fileData,
    fileName,
    authorName,
  } = data;

};

proto.getPost = async function () {};
proto.getAllPost = async function () {};
proto.createUser = async function () {};
proto.getLatest = async function () {};
proto.getTrendingPost = async function () {};
proto.searchPost = async function () {};
proto.saveImage = async function () {};
proto.getImage = async function () {};
proto.login = async function () {};
proto.sighUp = async function () {};


module.exports.Interactor=Interactor;