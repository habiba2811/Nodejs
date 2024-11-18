const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // solution 1 : load entire file in memory and atfer that it sends data, not best practice
  //   fs.readFile('./test-file.txt', (err, data) => {
  //     if (err) console.log(err);
  //     res.end(data);
  //   });
  // });
  // solution 2 : streams => backpressure readable stream is fatser then sending result with response writable stream
  //   const readable = fs.createReadStream('./test-file.txt');
  //   readable.on('data', (chunk) => {
  //     res.write(chunk); // the response is a writtable stream
  //   });
  //   readable.on('end', () => {
  //     res.end();
  //   });
  //   readable.on('error', (err) => {
  //     console.error('Error reading file:', err);
  //     res.statusCode = 500;
  //     res.end('file not found');
  //   });

  // Solution 3 => using pipe stream (while reading also writing) duplex or transform
  const readable = fs.createReadStream('./test-file.txt');
  readable.pipe(res);
  // readableSource.pipe(writableDest)
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
