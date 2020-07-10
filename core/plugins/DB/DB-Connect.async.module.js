const log = console.log;

const mongoose = require("mongoose");

async function connectToDataBase() {

  /*
    const db = await mongoose.connect("mongodb://localhost:27017/admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


  */
  const db = await mongoose.connect("mongodb+srv://cosmo:BPWZWck8bCN0hStE@cluster0-guxyc.mongodb.net/<dbname>?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  

  const crypto = require("crypto");
  const mongodb = require('mongodb');
  mongoose.Promise=global.Promise;
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
    thum:String,//thumnail image uplaad id
    comments: [
      {
        userId: String,
        userName:String,
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
      db:db.connection.db,
      mongoose:mongoose,
    },
  };
}

module.exports = connectToDataBase()
  .catch((e) => {
    throw e;
  })
  .finally(() => {
      //Any resourcse to release
  });
