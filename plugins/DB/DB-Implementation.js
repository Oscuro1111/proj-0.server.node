const { createUser } = require("../../App/Entity/User");
const { createPost } = require("../../App/Entity/post");

const create = {
  User: createUser,
  Post: createPost,
};
const __createPost = async function (data, { Post }) {
  const post = new Post();

  Object.assign(post, data);

  await post.save();

  data["_id"] = post._id;

  return data;
};

const __createUser = async function (data, { User }) {
  const user = new User();

  Object.assign(user, data);
  await user.save();
  data["_id"] = user._id;
  return data;
};

async function __createAuth(data, { Auth }) {
  const auth = new Auth();

  Object.assign(auth, data);

  await auth.save();

  data["_id"] = auth._id;

  return data;
}

async function updateUser(update, { User }) {
  return await User.findByIdAndUpdate(
    update._id,
    update,
    { useFindAndModify: false, new: true },
    (err, updated) => {
      if (err) {
        return null;
      }
      return updated;
    }
  ).then((updated) => create[update.type](updated));
}

async function updatePost(update, { Post }) {
  return await Post.findByIdAndUpdate(
    update._id,
    update,
    { useFindAndModify: false, new: true },
    (err, updated) => {
      if (err) {
        console.error(err);
      }
      return updated;
    }
  ).then((updated) => create[update.type](updated));
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
          return false;
        }

        return data;
      })
      .then((data) => {
        return create[type](data);
      });
  },
  findAll: (type) => {},
  filterByField: ({ type, prop }) => {},

  delete: async (data) => {
    try {
      await DB.Schema[data.type].findByIdAndDelete(data._id || data.id, {}); //no options

      return {done:true};
    } catch (error) {
      return {done:false,err:error};
    }
  },
});
