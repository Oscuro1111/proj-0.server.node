const { createUser } = require("../../App/Entity/User");
const { createPost } = require("../../App/Entity/post");

const create = {
  User: createUser,
  Post: createPost,
};

const log = console.log;
const __createPost = async function (data, { Post }) {
  const post = new Post();

  Object.assign(post, data);

  const intiSave = new Promise((resolve, reject) => {
    try {
      post.save((err, data) => {
        if (err) resolve({ err: err });
        else {
          resolve(data);
        }
      });
    } catch (error) {
      resolve({ err: error });
    }
  });

  const post_ = await intiSave;

  if (post_.err) {
    return { err: post_.err };
  }

  data["_id"] = post_._id;
  return { err: false, data: data };
};

const __createUser = async function (data, { User }) {
  const user = new User();

  Object.assign(user, data);
  const initSave = new Promise((resolve, reject) => {
    try {
      user.save((err, data) => {
        if (err) {
          resolve({ err: err });
        } else {
          resolve(data);
        }
      });
    } catch (err) {
      resolve({ err: err });
    }
  });

  const user_ = await initSave;
  data["_id"] = user_._id;

  return { err: false, data: data };
};

async function __createAuth(data, { Auth }) {
  const auth = new Auth();

  Object.assign(auth, data);
  const initSave = new Promise((resolve, reject) => {
    try {
      auth.save((err, data) => {
        if (err) {
          resolve(err);
        } else {
          resolve(data);
        }
      });
    } catch (error) {
      resolve({ err: error });
    }
  });

  const auth_ = await initSave;
  data["_id"] = auth_._id;

  return { err: false, data: data };
}

async function updateUser(update, { User }) {
  return await User.findByIdAndUpdate(
    update._id,
    update,
    { useFindAndModify: false, new: true },
    (err, updated) => {
      if (err) {
        return { err: err };
      }
      return updated;
    }
  ).then((updated) => {
    if (updated.err) return updated;
    return create[update.type](updated);
  });
}

async function updatePost(update, { Post }) {
  return await Post.findByIdAndUpdate(
    update._id,
    update,
    { useFindAndModify: false, new: true },
    (err, updated) => {
      if (err) {
        return { err: err };
      }
      return updated;
    }
  ).then((updated) => {
    if (updated.err) return updated;
    return create[update.type](updated);
  });
}

//Database operations
module.exports = ({ DB }) => ({
  save: async function (data) {
    if (data.type === "User") {
      return await __createUser(data, DB.Schema);
    }

    if (data.type === "Post") {
      return await __createPost(data, DB.Schema);
    }

    if (data.type === "Auth") {
      return await __createAuth(data, DB.Schema);
    }
  },
  update: async (data) => {
    if (data.type === "User") {
      return await updateUser(data, DB.Schema);
    }

    if (data.type === "Post") {
      return await updatePost(data, DB.Schema);
    }
  },

  validateUser: async ({ pass, user }) => {
    return await DB.Schema.Auth.findById(user.auth).then((auth) =>
      auth.validatePassword(pass)
    );
  },
  findOne: async ({ type, id }) => {
    return await DB.Schema[type]
      .findById(id, {}, (err, data) => {
        if (err) {
          return { err: err };
        }

        return data;
      })
      .then((data) => {
        if (data && data.err) return data;
        if (data) return create[type](data);

        return { err: "Not found or undefined err!" };
      });
  },
  findAll: async (type) => {
    return await DB.Schema[type]
      .find((err, list) => {
        if (err) {
          return { err: err };
        }
        return list;
      })
      .then((list) => list);
  },

  findAndSelect: async ({ type, prop, select }) => {
    //does not have .then

    const prom = new Promise((resolve, reject) => {
      DB.Schema[type]
        .findOne(prop)
        .select(select)
        .lean()
        .exec((err, list) => {
          if (err) {
            resolve({ err: err });
          }

          resolve(list);
        });
    }).catch((ex) => {
      throw ex;
    });

    return await prom.then((result) =>(result||{}));
  },

  delete: async (data) => {
    try {
      await DB.Schema[data.type].findByIdAndDelete(data._id || data.id, {}); //no options

      return { done: true };
    } catch (error) {
      return { done: false, err: error };
    }
  }, //End delete

  deleteFile: async function (fileId, bucketName) {
    const { db, ObjectId } = DB.Schema;

    const delChunks = new Promise((resolve, reject) => {
      db.collection(bucketName + ".chunks", function (err, collection) {
        if (err) {
          resolve({ err: err });
        }
        collection.deleteMany({ files_id: ObjectId(fileId) }, function (
          err,
          result
        ) {
          if (err) {
            resolve({ err: err });
          }
          resolve({ result: result });
        }); //End collection.deleteMany
      }); //End db.collection
    }); //End of delChunks

    const result1 = await delChunks;

    if (result1.err) {
      return { err: err };
    }

    const delFile = new Promise((resolve, reject) => {
      db.collection(bucketName + ".files", function (err, collection) {
        if (err) {
          resolve({ err: err });
        }
        collection.deleteOne({ _id: ObjectId(fileId) }, function (err, result) {
          if (err) {
            resolve({ err: err });
          }

          resolve({ result: result });
        });
      });
    }); //End of delFile

    const result2 = await delFile;

    if (result2.err) {
      return { err: err };
    }

    return { result1, result2 };
  },
  ObjectId:DB.Schema.ObjectId
});
