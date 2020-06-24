function Utils(Modules) {
  this.name = "utils";
  this.Modules = Modules;
}

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
    return { err: err };
  }

  return result;
};

proto.matchPattern = function (pattern, toMatch) {
  const str = new String(pattern);
  const words = str.split(" ");
  let init = false;

  let isMatched = words.reduce((preVal, current) => {
    let exp = new RegExp(current);
    if (preVal) {
      return true;
    }
    if (exp.test(toMatch)) {
      //macthed current word in toMatch string
      return true;
    } else {
      return false;
    }
  }, init);

  return isMatched ? true : false;
};

module.exports.Utils = Utils;
