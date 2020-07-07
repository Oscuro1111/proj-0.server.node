module.exports = function (dir, express, fs) {
  const router = express.Router();
  return router.get(
    "/createPost",
    [
      function (req, res, next) {
        if (req.session.user) {
          next();
        } else {
          res.redirect("/login");
          return;
        }
      },
    ],
    function (req, res, next) {
      
      const data = fs.readFileSync(dir + "/public/createPost.html");
      res.set("Content-Type", "text/html");
      res.status(200).send(data);
    }
  );
};
