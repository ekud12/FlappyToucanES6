/**
 * Author: Liel Kaysari
 * Import All Modules
 */
import bodyParser from "body-parser";
import errorHandler from "errorhandler";
import express from "express";
import http from "http";
import methodOverride from "method-override";
import logger from "morgan";
import path from "path";
import favicon from "serve-favicon";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import * as mainServer from "./server/MainController";
import { config as Config } from "./config";
import webpackConfig from "./webpack.config.babel.js";

const app = express();
const port = process.env.PORT || 5000;
/**
 * Set Middleware
 */
app.use(webpackMiddleware(webpack(webpackConfig)));
app.set("port", port);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(logger("dev"));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "client")));

/** TODO : REMOVE */
if ("development" == app.get("env")) {
  app.use(errorHandler());
}

app.get("/", (req, res) => {
  res.render("../client/flappytoucan");
});

/**
 * Load Config File
 */
app.get("/config.js", (req, res) => {
  res.sendFile("config.js", { root: __dirname });
});

/**
 * Start Server Listen on port
 */
const server = http.createServer(app).listen(app.get("port"), () => {
  console.log(`Afeka Flappy Toucan is ON! ${app.get("port")}`);
});

const io = require("socket.io")(server, { pingTimeout: 30000 });

/**
 * Run Game on Server
 */
mainServer.startServer(io);
