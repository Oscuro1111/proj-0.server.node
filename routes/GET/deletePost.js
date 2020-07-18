module.exports= function(
    express,
    coreModule
){
    const router = express.Router();

    return router.get('/delete/:postID',function(req,res,next){
        if(req.session.user){
            next();
        }else{
            res.redirect('/login');
        }
    },async function(req,res,next){
        const postID = req.params.postID  ;
        const uid    = req.session.user.id;  


    const result =   await coreModule.deletePost({
            uId:uid,
            postId:postID
        });

        if(result){
            res.status(200).send(`postId::[${postID}] deleted successfully from database.`);
        }else{
            res.status(503).send("Internal server error!");
        }
    });
}