#!/usr/bin/env node

/**
 * Module dependencies.
 */


const debug = require("debug")("node.genric.server:server");

const getApp = require("../app");

const http = require("http");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "4000");
const skt_ ={}; 
module.exports._start = function (coreModule) {
  
  const app = getApp(coreModule,skt_);
  
  app.set("port", port);

  const server = http.createServer(app);
  
  const io= require('socket.io')(server);

  skt_.io=io;
  /**
   * Create HTTP server.
   */
  


  server.setTimeout(1000*60*60);
  /**
   * Event listener for HTTP server "listening" event.
   */

  const onListening = function () {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
  };

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port, function () {
    console.log(server.address());
  });

  /**
   * Event listener for HTTP server "error" event.
   */

  const onError = function (error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  server.on("error", onError);
  server.on("listening", onListening);

  return true;
};

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
