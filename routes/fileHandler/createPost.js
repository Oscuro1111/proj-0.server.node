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

      const { title ,fileData} = req.body;

      const fileData_ = Buffer.from(fileData);//
      const fileName = `${title}.html`;


      const result = await coreModule.createPost({
        id: req.session.user.id,
        title: title,
        fileData: fileData_,
        fileName: fileName,
      });//result

      if (result) {
        res.redirect("http://localhost:3000/");
        return;
      } else {//end result
        res.status(400).send("503 Internal server error!");
      }//
    }
  );
};
