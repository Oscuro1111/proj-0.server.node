const log = console.log;

const mongoose = require("mongoose");

//const url;
async function connectToDataBase() {
  const db = await mongoose.connect("mongodb://localhost:27017/admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const crypto = require("crypto");
  const mongodb = require('mongodb');
  const User = mongoose.Schema({
    name: String,
    email: String,
    dateJoined: {
      type: Date,
      default: Date.now,
    },
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    }],
  });

  const Auth = mongoose.Schema({
    salt: String,
    hash: String,
  });

  Auth.methods.validatePassword = function (pass) {
    let _hash = crypto.pbkdf2Sync(pass, this.salt, 500, 64, `sha512`).toString("hex");

    return (this.hash == _hash);
  };

  const Post = mongoose.Schema({
    title: String,
    author: String,
    fileName:String,
    fileId:String,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    date: {
      type: Date,
      default: Date.now,
    },
    postFile: String,
    comments: [
      {
        userId: String,
        text: String,
        reply: [
          {
            userId: String,
            text: String,
          },
        ],
      },
    ],
  });
  return {
    mongodb: mongodb,
    connection: db.connection,
    Schema: {
      User: mongoose.model("User", User), //collection name creating model for intracting with underlying mongoDB read write operations mpa our schema
      Auth: mongoose.model("Auth", Auth),
      Post:mongoose.model('Post',Post),
      ObjectId:mongoose.Types.ObjectId,
    },
  };
}

module.exports = connectToDataBase()
  .catch((e) => {
    throw e;
  })
  .finally(() => {
    log("Call to DB Executed.");
  });
