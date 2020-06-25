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

  if (id.length == 0) {
    return false;
  }
  const post = await this.utils.getPost(id);

  if (post.err) {
    return false;
  }
  if (post) {
    const { fileName, fileId, author, title, date } = post;

    const bucket = createBucket(); //default bucket Posts.Data

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
    }; //Send post data back
  } else {
    return false;
  } //if err
};
proto.getAllPost = async function () {
  //Done
  const { DB, createBucket } = this.Modules;
  const posts = [];
  const postList = await DB.findAll("Post");

  if (postList.err) {
    return false;
  }

  if (postList.length && postList.length == 0) {
    return false;
  }

  const bucket = createBucket();

  for (const { author, title, date, fileName, fileId } of postList) {
    const file = await bucket.downloadFile(fileId);

    if (file.err) {
      return false;
    }

    const fileData = file.data;
    const timePassed = ((d) => {
      let d1 = Date.parse(d);
      return d1;
    })(date);

    posts.push({ author, fileName, fileData, title, timePassed, date });
  }
  return posts;
};

proto.getLatestPosts = async function (timeOld = null) {
  const posts = await this.getAllPost();
  const now = Date.now();
  const timeSpan = timeOld || 48 * 60 * 1000; //default:Last 2 days long
  const limit = now - timeSpan; //2 days back
  const latest = [];

  if (!posts) {
    return false;
  }

  for (const post of posts) {
    if (limit < post.timePassed) {
      latest.push(post);
    }
  }

  return latest;
};

proto.searchPost = async function (pattern) {
  const postList = await this.getAllPost();
  const matched = [];
  if (!postList) {
    return false;
  }

  for (const post of postList) {
    let title = new String(post.title);

    if (this.utils.matchPattern(pattern, title)) {
      matched.push(post);
    }
  }

  if (matched.length === 0) {
    return false;
  }

  return matched;
};

proto.saveImage = async function ({ fileName, fileData }) {
  const { createBucket } = this.Modules;
  const bucketName = "Images.Data";
  const bucket = createBucket({bucketName:bucketName});
  const info = await bucket.uploadFile({ name: fileName, data: fileData });
  if (info.err) {
    return false;
  }
  return info.uploadId;
};
proto.getImage = async function (id) {
  const { createBucket } = this.Modules;
  const bucketName = "Images.Data";
  const bucket = createBucket({bucketName:bucketName});

  const file = await bucket.downloadFile(id);

  if (file.err) {
    return false;
  }

  return file.data;
};
proto.login = async function ({ pass, user }) {
  const { DB } = this.Modules;

  const isAuthorized = await DB.validateUser({
    pass: pass,
    user: user,  
  });

  return isAuthorized;
};

module.exports.Interactor = Interactor;
