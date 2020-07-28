//require('dotenv').config()
const http = require('http');
const childProcess = require('child_process');
const port = process.env.PORT || 9056;

function clearVarnish() {
  console.log('Processing...');
  let cmd = `varnishadm -S /etc/varnish/secret -T 127.0.0.1:6082 'ban req.http.host ~ (^demowebnew1.online$)'`
  childProcess.exec(cmd, function (err, stdout, stderr) {
    if (err) {
      console.error(err);
    }
    console.log(stdout);
    console.log(stderr);
  });
}

http
  .createServer(function (req, res) {
    req.on('data', function (chunk) {
      console.log('[OK]');
      clearVarnish();
    });
    
    res.write('Clear Varnish!'); //write a response to the client
    res.end(); //end the response
  })
  .listen(port, () => console.log(`App listening on port ${port}!`));
