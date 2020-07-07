module.exports= function(express,coreModule){

    const router = express.Router();

  return router.post('/signUp',async function(req,res,next){
      const {
          user,
          email,
          pass
      }=req.body;

      const id = await coreModule.createUser({
          user:user,
          email:email,
          pass:pass
      });

      if(id.msg){
          res.status(200).send("User with same email address already exist.");
          return;
      }
      
      req.session.user={
          id:id,
          isAuthorized:true
      };

      res.redirect('/createPost');
  }); 
}