const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cros = require("cors");
const session = require("express-session");
 var fileUploads = require('express-fileupload');
 
 //const indexRouter = require("./routes/index");
 const GetPost = require("./routes/posts");
 const GetLatesPost = require('./routes/latestPosts');
 const SearchPost = require('./routes/search');
 const GetPostData = require('./routes/getPost');
 const CreatePost   = require('./routes/fileHandler/createPost');
 const app = express();
 
 //const test = require("./routes/routev1/temp");
 // view engine setup
 app.use(cros(null));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "qwertyuiopzxcvbnmasdfghjkl",
    resave: true,
    saveUninitialized: false,
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use(fileUploads({
  abortOnLimit:true,
  limits:{fileSize:100000*1024*500000*100000}
}));


module.exports = (coreModule)=>{

app.use('/posts',GetPost(express,coreModule));
app.use('/latestPosts',GetLatesPost(express,coreModule));
app.use('/search',SearchPost(express,coreModule));
app.use('/post',GetPostData(express,coreModule));
app.use('/auth',CreatePost(express,coreModule));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
  return app;
};
