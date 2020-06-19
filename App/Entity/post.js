//POST ENTITY
const {NULL_POST} = require('../Entity/Errors');

function Post(post) {
  this.type="Post";

  if(post._id){
    this._id=post._id;
  }
  this.fileName=post.fileName;
  this.fileId=post.fileId;
  this.title=post.title;
  this.author=post.author;
  this.comments=post.comments;
}

Post.prototype = new Object();

Post.prototype.validate = function (post) {
  //logic
  return  true;
};


module.exports.createPost = function (post) {
  var errMsg=NULL_POST;

  if (post&&(errMsg = Post.prototype.validate(post))) {
    return new Post(post);
  } else errMsg;
};
