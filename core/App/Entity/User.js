const { NULL_POST } = require("./Errors");
function User(user) {
  this.type = "User";

  if (user._id) {
    this._id = user._id;
  }
  if (user.dateJoined) {
    this.dateJoined = user.dateJoined;
  }
  this.name = user.name;
  this.email = user.email;
  (this.auth = user.auth), (this.posts = user.posts); //id or ref of post
}

module.exports.createUser = (user) => {
  //validate data formate here
  return (user && new User(user)) || NULL_POST;
};
