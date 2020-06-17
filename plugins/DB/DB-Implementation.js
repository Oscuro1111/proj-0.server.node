const { createUser } = require("../../App/Entity/User");
const { createPost } = require("../../App/Entity/post");

const create = {
  User: createUser,
  Post: createPost,
};

const callback = (err, data) => {
  if (data) {
    return;
  }
  if (err) {
    throw err;
  }
};

const log = console.log;
const __createPost = async function (data, { Post }) {
  const post = new Post();

  Object.assign(post, data);

  try {
    await post.save(callback);
  } catch (error) {
    return { err: error };
  }

  data["_id"] = post._id;
  return { err: false, data: data };
};

const __createUser = async function (data, { User }) {
  const user = new User();

  Object.assign(user, data);

  try {
    await user.save(callback);
  } catch (err) {
    return { err: err };
  }

  data["_id"] = user._id;

  return { err: false, data: data };
};

async function __createAuth(data, { Auth }) {
  const auth = new Auth();

  Object.assign(auth, data);

  try {
    await auth.save(callback);
  } catch (error) {
    return { err: error };
  }

  data["_id"] = auth._id;

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
        if (data.err) return data;
        return create[type](data);
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
    }).catch(ex=>{
        throw ex;
    });

    return await prom.then(result=>result);
  },

  delete: async (data) => {
    try {
      await DB.Schema[data.type].findByIdAndDelete(data._id || data.id, {}); //no options

      return { done: true };
    } catch (error) {
      return { done: false, err: error };
    }
  },
});
