/**
 * Author:Oscuro Smith
 * Interactor for executing core logic for application.
 *
 */
const { createUser } = require("../Entity/User");
const { createPost } = require("../Entity/post");
const { createAuthInfo } = require("../Entity/auth");
const { Utils } = require("./util/utils");
const { UNVALID_PASSWORD_LENGTH } = require("../Entity/Errors");
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
    title, //title
    fileData, //File data
    fileName, //File name
  } = data;

  const bucket = createBucket();

  const user = await this.utils.getUser(id); //Do not destruchure any fuction using this inside
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
  return post._id;
}; //End of post create

proto.createUser = async function (data) {
  const { DB } = this.Modules;
  const { name, email, pass } = data;

  const auth = createAuthInfo({ pass: pass });

  if (auth === UNVALID_PASSWORD_LENGTH) {
    return false;
  }

  const authRes = await DB.save(auth);

  if (authRes.err) {
    return false;
  }

  const user = createUser({
    name: name,
    email: email,
    posts: [],
    auth: auth._id,
  });

  const res = await DB.save(user);

  if (res.err) {
    console.log("No user");
    return false;
  }

  return user._id;
};

proto.getPostData = async function (id) {
  const { createBucket } = this.Modules;

  if (id.length==0) {
    return false;
  }
  const post = await this.utils.getPost(id);

  
  if(post.err){
      return false;
  };
  if (post) {
    const { fileName, fileId, author, title, date } = post;

    const  bucket = createBucket(); //default bucket Posts.Data

    const file = await bucket.downloadFile(fileId);

    if (file.err) {
     
      return false;
    }

    const fileData = file.data;

    return {
      title,
      author,
      fileName,
      fileData,
      date,
    };//Send post data back

  } else {
    return false;
  }//if err
};
proto.getAllPost = async function () {};
proto.getLatest = async function () {};
proto.getTrendingPost = async function () {};
proto.searchPost = async function () {};
proto.saveImage = async function () {};
proto.getImage = async function () {};
proto.login = async function () {};

module.exports.Interactor = Interactor;
