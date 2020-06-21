/**
 * Author:Oscuro Smith
 * Interactor for executing core logic for application.
 *
 */
const { createUser } = require("../Entity/User");
const { createPost } = require("../Entity/post");
const { createAuthInfo } = require("../Entity/auth");
const { Utils } = require("./util/utils");
const {UNVALID_PASSWORD_LENGTH} = require('../Entity/Errors');
const log = console.log;

function Interactor(Modules) {
  this.utils = new Utils(Modules);
  this.Modules = Modules;
}

Interactor.prototype = new Object();

const proto = Interactor.prototype;

/**
 *
 * @param data
 */
proto.createPost = async function (data) {
  const { DB, createBucket } = this.Modules;

  const {
    id, // user id
    title,//title
    fileData, //File data
    fileName, //File name
  } = data;

  const bucket = createBucket();

  const user = await  this.utils.getUser(id);

  if (user.err) {
    return false;
  }

  const fileId = await bucket.uploadFile({ name: fileName, data: fileData });

  if (fileId.err) {
    return false;
  }

  const post = createPost({
    title: title,
    author: user.name,
    fileName: fileName,
    fileId: fileId.uploadId,
    comments: [],
  });

  const result = await DB.save(post);

  if (result.err) {
    return false;
  }

  user.posts.push(post._id);

  const res = await DB.update(user);

  if (res.err) {
    return false;
  }
  return true;
};//End of post create


proto.createUser = async function (data) {
  const {DB} = this.Modules;
  const {
    name,
    email,
    pass,
  }=data;
  
  const auth  = createAuthInfo({pass:pass});
  
  if(auth===UNVALID_PASSWORD_LENGTH){
    return false;
  }

  const authRes=await DB.save(auth);

  if(authRes.err){
    return false;
  }

  const user =  createUser({
    name:name,
    email:email,
    posts:[],
    auth:auth._id,
  });

 const res= await DB.save(user);

 if(res.err){
   return false;
 }

  return true;
};

proto.getPost = async function () {};
proto.getAllPost = async function () {};
proto.getLatest = async function () {};
proto.getTrendingPost = async function () {};
proto.searchPost = async function () {};
proto.saveImage = async function () {};
proto.getImage = async function () {};
proto.login = async function () {};

module.exports.Interactor = Interactor;
