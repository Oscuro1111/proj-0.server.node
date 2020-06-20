var express = require("express")
var path = require("path");



module.exports=()=>{
  var route = express.Router()
    
   route.get("*",(req,res,next)=>{
     res.send("Send from  gernic node server");
   })
   return route;
}

