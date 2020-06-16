const {NULL_POST} = require('./Errors'); 
function User(user){
        this.type="User";
        this._id = user._id||null;
        this.name=user.name;
        this.email=user.email;
        this.auth=user.auth,
        this.post=user.posts;//id or ref of post
}



module.exports.createUser=(user)=>{
//validate data formate here
    return user&&new User(user)|| NULL_POST;
}