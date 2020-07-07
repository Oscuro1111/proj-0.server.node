module.exports=function(dir,express,fs,){
    const router = express.Router();
    
    return router.get('/login',function(req,res,next){

        if(req.session.user){
          
            res.redirect('/createPost'); 
        }else{
        const data=fs.readFileSync(dir+'/public/login.html');

        res.set("Content-Type","text/html");
        res.status(200).send(data.toString());
        }
    });
}