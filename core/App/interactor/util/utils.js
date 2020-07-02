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

/**
 *
 * @param list array List
 * @param item -item to remove
 * @description accept array  of list and remove elememt from it
 * @returns removed array lists
 *
 */
proto.deleteFromList = function (list, item) {
  if (list.findIndex) {
    
    const index = list.findIndex((ele) => {
      return ele == item;
    });

    if (index === -1) {
      return -1;
    }
    return list.splice(index, 1);
  }

  return -1;
};
module.exports.Utils = Utils;
