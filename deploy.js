//require('dotenv').config()
const http = require('http');
const crypto = require('crypto');
const childProcess = require('child_process');
const secret = process.env.WEBHOOK_SECRET || 'wn';
const port = process.env.PORT || 9055;

function deploy() {
  console.log('Processing...');
  childProcess.exec('git pull', function (err, stdout, stderr) {
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
      // Tạo mã sha1 từ secret và dữ liệu body nhận được
      let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

      let x_sig = req.headers['x-hub-signature'];
      console.log('[SIG] sig:' +sig + '. x-sig:'+x_sig)
      // So sánh mã được tạo ra và mã trong header gửi kèm. Nếu đúng thì chạy deploy
      if (x_sig == sig) {
        deploy();
      }
    });
    
    res.write('Deploy!'); //write a response to the client
    res.end(); //end the response
  })
  .listen(port, () => console.log(`App listening on port ${port}!`));
