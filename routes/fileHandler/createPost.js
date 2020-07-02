module.exports=function(express,coreModule){
     const router = express.Router();

     return router.post('/create/post/',function(req,res,next){
         console.log(req.body);
         console.log(req.files);
         res.status(200).send('Done');
     });
}