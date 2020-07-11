const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cros = require("cors");
const session = require("express-session");
var fileUploads = require("express-fileupload");
var fs = require("fs");

const index = require("./routes/index");
const LoginGet = require("./routes/GET/login");
const LoginPost = require("./routes/POST/login");
const SignUpGet = require("./routes/GET/signUp");
const SignUpPost = require("./routes/POST/signUp");
const Logout = require("./routes/GET/logout");

const GetPost = require("./routes/posts");
const GetLatesPost = require("./routes/latestPosts");
const SearchPost = require("./routes/search");
const GetPostData = require("./routes/getPost");
const CreatePost = require("./routes/fileHandler/createPost");
const ImageHandler = require("./routes/POST/saveImage");
const GetImage = require("./routes/POST/getImg");
const TempImg = require("./routes/GET/tempRout");
const app = express();

// view engine setup
app.use(cros(null));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("qwertyuiop"));

app.use(
  session({
    secret: "qwertyuiopzxcvbnmasdfghjkl",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 10 },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use(
  fileUploads({
    abortOnLimit: true,
    limits: { fileSize: 16 * 64 * 1024 * 1024 * 1024 },
  })
);

module.exports =(coreModule, skt_) => {

  app.use("/", index);
  app.use(LoginGet(__dirname, express, fs));
  app.use(LoginPost(express, coreModule));
  app.use(Logout(__dirname, express, fs));
  app.use(SignUpGet(__dirname, express, fs));
  app.use(SignUpPost(express, coreModule));

  app.use(require("./routes/createPost")(__dirname, express, fs));
  app.use("/posts", GetPost(express, coreModule));
  app.use("/latestPosts", GetLatesPost(express, coreModule));
  app.use("/search", SearchPost(express, coreModule));
  app.use("/post", GetPostData(express, coreModule));
  app.use(GetImage(express, coreModule));
  app.use(TempImg(express));
  app.use(ImageHandler(express, coreModule, skt_));
  app.use("/auth", CreatePost(express, coreModule));
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
