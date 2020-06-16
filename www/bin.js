const { createUser } = require("../App/Entity/User");

const { createAuthInfo } = require("../App/Entity/auth");


async function server({ DB }) {
const id= "5ee8ac9c8e19d42ba424d315";

const user =  await DB.findOne({type:"User",id:id});

//const auth = createAuthInfo({pass:"OscuroSmith"});

//await DB.save(auth);

let result = await DB.delete({type:"Auth",id:user.auth});

user.auth =null;
 //user.auth = auth._id;
 if(result.done){
   console.log("Deleted succssfully !");
 }else{
   console.log("Error:"+`${result.err}`);
}


await DB.update(user);






//const deleted = await DB.delete({type:"Auth",id:user.auth});

 // const auth = createAuthInfo({ pass: "Oscuro1999" });
  
  //await DB.save(auth);
  
  //const userA = createUser({
    //name: "Oscuro",
    //email: "oscuro@gmail.com",
   // auth: auth._id,
   // posts: [],
  //});

  //const user = await DB.save(userA);

//  const isAuthorized = await DB.validateUser({
  //  pass: "Oscuro1999",
   // user: user,
  //});

  //if (isAuthorized) {
  //  console.log("User is Authorized");
  //} else { 
    //console.log("User is not authorized");
  //}

  //user.name="XAGENT";

 //const updated = await DB.update(user);

  //console.log(updated);
}

(async (loader) => {
  const Modules = (await loader()).get();

  const initializationProceduer = new Promise((resolve, reject) => {
    Modules["DB"] = require("../plugins/DB/DB-Implementation")(Modules); //implementing interface
    resolve(Modules);
  })
    .then((Mod) => {
        server(Mod);
    })
    .catch((e) => {
      throw e;
    });  
})(require("../App/pluginLoader/loader"));
