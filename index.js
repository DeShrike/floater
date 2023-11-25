const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const http = require("http");
const https = require("https");
const fs = require("fs");

var CONFIG =  require("./config.json");
let port = 0;
let host = "";
let otherport = 0;
let otherhost = "";
let certfile_prefix = "";

var arguments = process.argv;
// console.log(arguments);

if (arguments.length != 3)
{
   show_usage();
   process.exit();
}

if (arguments[2] !== "com" && arguments[2] != "be" && arguments[2] !== "shop" )
{
   show_usage();
   process.exit();
}

if (arguments[2] === "com")
{
   port = CONFIG.port_com;
   host = CONFIG.host_com;
   otherhost = CONFIG.host_be;
   otherport = CONFIG.port_be;
   certfile_prefix = CONFIG.certfileprefix_com;
}
else if (arguments[2] === "be")
{
   port = CONFIG.port_be;
   host = CONFIG.host_be;
   otherhost = CONFIG.host_com;
   otherport = CONFIG.port_com;
   certfile_prefix = CONFIG.certfileprefix_be;
}
else if (arguments[2] === "shop")
{
   port = CONFIG.port_shop;
   host = CONFIG.host_shop;
   otherhost = CONFIG.host_be;
   otherport = CONFIG.port_be;
   certfile_prefix = CONFIG.certfileprefix_shop;
}

const app = express();

const options = {
   key: fs.readFileSync(__dirname + "/ssl/" + certfile_prefix + ".key", "utf8"),
  cert: fs.readFileSync(__dirname + "/ssl/" + certfile_prefix + ".crt", "utf8")
};

function show_usage() {
   console.log("Usage: node index.js [com|be|shop]");
}

function base64ToBytes(base64) {
   const binString = atob(base64);
   return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function base64ToString(base64) {
   return new TextDecoder().decode(base64ToBytes(base64));
}

function setCORS(req, res) {

   res.set({
      "Access-Control-Allow-Origin": "https://" + otherhost + ":" + otherport,
      //"Access-Control-Allow-Origin": "http://" + otherhost + ":" + port + ", https//" + thishost + ":" + port,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST",
      "Access-Control-Allow-Headers": "Content-Type"
   });
}

app.set("view engine", "ejs");
app.use(cookieParser());

app.use((req, res, next) => {
   console.info(`${req.method} ${req.originalUrl}`);
   res.on("finish", () => {
      console.info(`  ${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`);
   });

   next();
});

app.use(express.static(path.join(__dirname, "www")));

app.get("/" , (req , res) => {
   let coo = [];
   for (const obj in req.cookies) {
      coo.push({ name: obj, value: req.cookies[obj]});
   }

   setCORS(req, res);

   res.render("index" , {
      host: host,
      otherhost: otherhost,
      port: port,
      otherport: otherport,
      tagline: "This is it !!",
      cookies: coo
   });
})

app.get("/ping", (req, res) => {
   // console.log("PING", req.query.data);
   const data = base64ToString(req.query.data);
   // console.log(data);

   const date = new Date();
   date.setHours(date.getHours() + 24);

   const parts = data.split(":");
   const cookieName = parts[0];
   const cookieValue = parts[1];
   setCORS(req, res);

   res.cookie(cookieName, cookieValue, {
      expires: date,
      httpOnly: true,
      secure: true,
      sameSite: "none",  // "strict", "lax", "none"
      //domain: host
   });

   res.send('{ "success": true }');
});

// app.listen(port, function () {
//    console.log(`Listening on port ${port}!`);
// });

var server = https
               .createServer(options, app)
               .listen(port, function() {
                  // console.log("Express server listening on port " + port);
                  console.log(`Listening: ${host} on port ${port}!`);
               });
