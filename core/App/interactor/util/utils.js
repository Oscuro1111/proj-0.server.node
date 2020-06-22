function Utils(Modules) {
  this.name = "utils";
  this.Modules = Modules;
};

Utils.prototype = new Object();
const proto = Utils.prototype;

proto.getUser = async function (id) {
  const { DB } = this.Modules;
  const result = await DB.findOne({ type: "User", id: id });

  if (result.err) {
    return false;
  }

  return result;
};

proto.getPost = async function (id) {
  const { DB } = this.Modules;
  
  const result = await DB.findOne({ type: "Post", id: id });
  if (result.err) {
    return {err:err};
  }

  return result;
};

module.exports.Utils = Utils;
