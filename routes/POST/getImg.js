module.exports=function(express,coreModule){

    const router = express.Router();

      
    
   router.get("/img/get/:id", async function (req, res, next) {
    const img = await coreModule.getImage(req.params.id);

    if (img) {
      res.status(200).send(img);

    } else {
      res.status(404).send("error");
    }
  });


  return router;

}