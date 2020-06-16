const { createPost } = require("../Entity/post");

const { createUser } = require("../Entity/User");

function userHandler(user) {
  const userA = createUser({
    type: "User",
    name: "Oscuro",
    email: "oscuroSmith@gmail.com",
    posts: [1222121],
    
  });

  DB.save(userA);

  console.log(userA.user.name);
  return DB;
}
console.log(userHandler());
