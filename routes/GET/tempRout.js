module.exports = function (express) {
  const router = express.Router();

  return router.get("/tempImg", function (req, res, next) {
    if (req.session.img) {
      if (req.session.imgs) {
        req.session.imgs.push(req.session.img);
      } else {
        req.session.imgs = [req.session.img];
      }
      
      res.status(200).send({ url: req.session.img });
    } else {
      res.status(404).send("Not Found");
    }
  });
};
