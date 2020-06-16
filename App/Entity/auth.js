const crypto = require("crypto");
const {UNVALID_PASSWORD_LENGTH} = require('./Errors');
function getHash(pass, salt) {
  return crypto.pbkdf2Sync(pass, salt, 500, 64, `sha512`).toString("hex");
}

function Auth({ pass, salt }) {
  this.type = "Auth";

  this.salt = salt;
  this.hash = getHash(pass, salt);
}

module.exports.createAuthInfo = function ({ pass }) {
  if (pass.split("").length >= 8) {
    const salt = crypto.randomBytes(16).toString("hex");
    return new Auth({ pass, salt });
  }else return UNVALID_PASSWORD_LENGTH;
};
