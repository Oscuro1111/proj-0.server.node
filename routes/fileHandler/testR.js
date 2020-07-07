module.exports=function(express,fs){
    const router = express.Router();

    return router.post('/test',function(req,res,next){

          // console.log(req.body);
           
           res.status(200).send("Done");
    });
} 