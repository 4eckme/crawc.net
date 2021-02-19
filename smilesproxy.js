//  Install npm dependencies first
//  npm init
//  npm install --save url@0.10.3
//  npm install --save http-proxy@1.11.1
var fs = require("fs");
var httpProxy = require("http-proxy");
var http = require("https")
var soptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/crawc.net/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/crawc.net/fullchain.pem'),
};
var url = require("url");
var net = require('net');

var request = require('request');




var express = require("express");
var app = express();
app.get('/', function(req, res) {
    res.end('test');
});
http.createServer(soptions, function (req, res) {
  var u = url.parse(req.url);
  console.log(u);
  
  request({url: 'https://www.jemoticons.com'+u.href, auth: {'user': 'zxc0', 'pass': 'zxcfr456'}}, callback);
  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        res.writeHead(200, req.headers);
        body = body.replace('</head>', '<style>.control a {display:none;} footer{padding: 2rem 1.5rem 6rem !important;} footer .content{display:none;}</style></head>');
        res.end(body);
        //console.log(response);
    }
  }
  //res.end();
}).listen(9000);


var server = http.createServer(soptions, function (req, res) {
    console.log(req.url);
  var urlObj = url.parse(req.url);
  var target = urlObj.protocol + "//" + urlObj.host;

  console.log("Proxy HTTP request for:", target);

  var proxy = httpProxy.createProxyServer({});
  proxy.on("error", function (err, req, res) {
    console.log("proxy error", err);
    res.end();
  });

  proxy.web(req, res, {target: target});
}).listen(8082);  //this is the port your clients will connect to

var regex_hostport = /^([^:]+)(:([0-9]+))?$/;

var getHostPortFromString = function (hostString, defaultPort) {
  var host = hostString;
  var port = defaultPort;

  var result = regex_hostport.exec(hostString);
  if (result != null) {
    host = result[1];
    if (result[2] != null) {
      port = result[3];
    }
  }

  return ( [host, port] );
};

server.addListener('connect', function (req, socket, bodyhead) {
  var hostPort = getHostPortFromString(req.url, 443);
  var hostDomain = hostPort[0];
  var port = parseInt(hostPort[1]);
  console.log("Proxying HTTPS request for:", hostDomain, port);

  var proxySocket = new net.Socket();
  proxySocket.connect(port, hostDomain, function () {
      proxySocket.write(bodyhead);
      socket.write("HTTP/" + req.httpVersion + " 200 Connection established\r\n\r\n");
    }
  );

  proxySocket.on('data', function (chunk) {
    socket.write(chunk);
  });

  proxySocket.on('end', function () {
    socket.end();
  });

  proxySocket.on('error', function () {
    socket.write("HTTP/" + req.httpVersion + " 500 Connection error\r\n\r\n");
    socket.end();
  });

  socket.on('data', function (chunk) {
    proxySocket.write(chunk);
  });

  socket.on('end', function () {
    proxySocket.end();
  });

  socket.on('error', function () {
    proxySocket.end();
  });

});
