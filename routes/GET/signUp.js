module.exports=function(dir,express,fs,){
    const router = express.Router();

    return router.get('/signUp',function(req,res,next){

        const data=fs.readFileSync(dir+'/public/signUp.html');

        res.set("Content-Type","text/html");
        res.status(200).send(data.toString());
    });
}