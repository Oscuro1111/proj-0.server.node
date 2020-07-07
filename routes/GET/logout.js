module.exports=function(dir,express,fs,){
    const router = express.Router();

    return router.get('/logout',function(req,res,next){

        if(req.session.user){
            delete req.session.user;
            res.status(200).send("Done logout!");    
        }else{
        const data=fs.readFileSync(dir+'/public/login.html');

        res.set("Content-Type","text/html");
        res.status(200).send(data.toString());
        }
    });
}