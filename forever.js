  var forever = require('forever-monitor');
 
  var child = new (forever.Monitor)('/home/zxc0/crawc.net/srv.js', {
    max: 3000000,
    silent: true,
    args: []
  });
 
  child.on('exit', function () {
    console.log('srv.js has exited after 3000000 restarts');
  });
 
  child.start();
