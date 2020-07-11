module.exports = function (express, core) {
  const router = express.Router();
//  const mime   = require('mime-types');
  return router.get("/data/:postId", async function (req, res, next) {
    const id = req.params.postId;
    var data = null;
    try{
     data = await core.getPostData(id);

    }catch(e){
      res.status(404).send({ data: null });
    }
    if (data) {
   // res.set('Content-Type',mime.lookup(fileName));
      //res.status(200).send([data]);
      res.status(200).send(data.fileData);
    } 
  });
};
