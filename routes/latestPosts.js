

module.exports=(express,core)=>{
    var route = express.Router()
      
     route.get("/*",async (req,res,next)=>{
 
       let day =24*60*60*1000;
       const posts=await core.getLatestPosts(20*day);
       res.send(posts);
     })
     return route;
  }
  
  