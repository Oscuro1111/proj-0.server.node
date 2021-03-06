module.exports = function (express, coreModule) {
  const router = express.Router();

  return router.post("/login", async function (req, res, next) {
    const { email, pass } = req.body;

    const user = await coreModule.login({
      pass: pass,
      emailID: email,
    });

    if (user.isAuthorized) {
      const user_ = await coreModule.utils.getUser(user.id);

      req.session.user = ((user.other = user_), user);

      res.redirect("/createPost");
      return;
    } else {
      res
        .status(404)
        .send(
          "Unvalid user name or password! Try again with valid user input !"
        );
      return;
    }

    //verify
    //1-session.cookie.originalMaxAge=day/4; 6 hours
    //  ||Linked
    //2-session.user={id,previlages="normal",auth='true'}
  });
};
