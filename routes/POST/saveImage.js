module.exports = function (express, coreModule,skt_) {
  const router = express.Router();

  router.post("/img/save", async function (req, res, next) {

    if (Object.keys(req.files) != 0) {
      const file = req.files.filepond;
      const fileName = file.name;
      const fileData = file.data;

      var id = await coreModule.saveImage({
        fileName: fileName,
        fileData: fileData,
      });

      if (id) {

          req.session.img = id; 
          
          res.set("Content-Type","text/plain");

          res.status(200).send("/img/get/" + id);
        return;
      } else {
        res.status(503).send("NULL");
        return;
      }
    }
  });
  return router;
};
