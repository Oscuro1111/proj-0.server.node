module.exports=function(express,core){
    const router =express.Router();

    return router.get('/post',async function(req,res,next){
        const pattern = req.query.pattern;
        console.log("patter::",req.query);
        const posts = await core.searchPost(pattern);
        if(posts){
            res.send(posts);
        }else{
            res.status(404).send([]);
        }
    });
}