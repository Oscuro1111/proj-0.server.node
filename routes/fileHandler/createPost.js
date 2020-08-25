module.exports = function (express, coreModule) {
  const router = express.Router();

  return router.post(
    "/create/post/",
    [
      function (req, res, next) {
        if (req.session.user) {
          next();
        } else {
          res.redirect("/login");
        }
      },
    ],//checking user  authorization
    async function (req, res, next) {

      const { title ,fileData,thum} = req.body;
      console.log(thum);

      const fileData_ = Buffer.from(fileData);
      const fileName = `${title}.html`;

  
      const result = await coreModule.createPost({
        id: req.session.user.id,
        title: title,
        fileData: fileData_,
        fileName: fileName,
        thum:thum,
      });//result author: req.session.user.other.name
      console.log(`${(new Date()).getMinutes()},postID::[${result}]`);
      if (result) {
        res.redirect("http://tech-inventory.herokuapp.com/");
        return;
      } else {//end result
        res.status(400).send("503 Internal server error!");
      }//
    }
  );
};
