

module.exports=(express,core)=>{
  var route = express.Router()
    
   route.get("/*",async (req,res,next)=>{

     const posts=await core.getAllPost();
     res.send(posts);
   })
   return route;
}

