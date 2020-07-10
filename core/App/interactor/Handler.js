/**
 * Author:Oscuro Smith
 * Interactor for executing core logic for application.(usecase)
 *
 */
const { createUser } = require("../Entity/User");
const { createPost } = require("../Entity/post");
const { createAuthInfo } = require("../Entity/auth");
const { Utils } = require("./util/utils");
const { UNVALID_PASSWORD_LENGTH } = require("../Entity/Errors");

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
    fileData, //File data -type:buffer ,encoding used: utf-8
    fileName, //File name
    thum  , //thumNailImage
  } = data;

  const bucket = createBucket();

  const user = await this.utils.getUser(id); //Do not destructure any fuction using this inside
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
    thum:thum//thumnail Image id upload id
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
  const { user, email, pass } = data;

  //checking user with this email id already existed or not
  const result = await DB.findAndSelect({
    type: "User",
    prop: {
      email: email,
    },
    select: "email",
  });

  if (result&&result._id) {
    return { msg: "User already existed!" };
  }

  const auth = createAuthInfo({ pass: pass });

  if (auth === UNVALID_PASSWORD_LENGTH) {
    return false;
  }

  const authRes = await DB.save(auth);

  if (authRes.err) {
    return false;
  }

  const user_ = createUser({
    name: user,
    email: email,
    posts: [],
    auth: auth._id,
  });

  const res = await DB.save(user_);

  if (res.err) {
    return false;
  }

  return user_._id;
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
    const { fileName, fileId, author, title, date,thum } = post;

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
      thum
    }; //Send post data back
  } else {
    return false;
  } //if err
};
proto.getAllPost = async function () {
  //Done
  const { DB } = this.Modules;
  const posts = [];
  const postList = await DB.findAll("Post");

  if (postList.err) {
    return false;
  }

  if (postList.length && postList.length == 0) {
    return false;
  }

  for (const { author, title, date, fileName, fileId, _id } of postList) {
    const timePassed = ((d) => {
      let d1 = Date.parse(d);
      return d1;
    })(date);
    const postId = _id;
    posts.push({ postId, author, fileName, title, timePassed, date, fileId });
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
  const bucket = createBucket({ bucketName: bucketName });
  const info = await bucket.uploadFile({ name: fileName, data: fileData });
  if (info.err) {
    return false;
  }
  return info.uploadId;
};
proto.getImage = async function (id) {
  const { createBucket } = this.Modules;
  const bucketName = "Images.Data";
  const bucket = createBucket({ bucketName: bucketName });

  const file = await bucket.downloadFile(id);

  if (file.err) {
    return false;
  }

  return file.data;
};
proto.login = async function ({ pass, emailID }) {
  const notAuthorized = false;
  const { DB } = this.Modules;

  const user = await DB.findAndSelect({
    type: "User",
    prop: {
      email: emailID,
    },
    select: null, //select all prop of user.
  });
  if (!user._id) {
    return notAuthorized;
  }

  const isAuthorized = await DB.validateUser({
    pass: pass,
    user: user, //require user object
  });

  return { isAuthorized: isAuthorized, id: user._id };
};
proto.deleteImg = async function (id) {
  const { DB } = this.Modules;

  const res = await DB.deleteFile(id, "Images.Data");

  return res;
};
proto.deletePost_ = async function (id) {
  //done-(must not use direactly in application logic-USER MUST UPDATED)
  const { DB } = this.Modules;
  const post = await this.utils.getPost(id);
  const { fileId } = post;

  const res = await DB.deleteFile(fileId, "Posts.Data");

  const res1 = await DB.delete(post);

  if (res.err || res1.err) {
    return false;
  }

  return { res, done: true, postID: id };
};

proto.deletePost = async function ({ uId, postId }) {
  //done
  const { DB } = this.Modules;

  const user = await this.utils.getUser(uId);
  if (!user.posts || user.posts.length == 0) {
    return { err: "no post found at user!" };
  }

  const res = await this.deletePost_(postId);
  if (!res.done) {
    return res;
  }

  if (this.utils.deleteFromList(user.posts, postId) == -1) {
    return { err: "Not able to remove postid from list halted user update" };
  }

  const res1 = await DB.update(user);
  if (res1.err) {
    return res1;
  }

  return res1;
};

module.exports.Interactor = Interactor;
