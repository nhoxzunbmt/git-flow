const express = require('express')
const app = express()
const port = 9056
const childProcess = require('child_process');

app.get('/', (req, res) => {
    res.send('Varnish service!')
})

app.get('/varnish', (req, res) => {
    let domain = req.query.domain;
    console.log('Processing...');
    let cmd = `varnishadm -S /etc/varnish/secret -T 127.0.0.1:6082 'ban req.http.host ~ (^${domain}$)'`
    childProcess.exec(cmd, function (err, stdout, stderr) {
      if (err) {
        console.error(err);
      }
      console.log(stdout);
      console.log(stderr);
    });
    res.send('webnew: ' + domain);
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))