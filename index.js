const fs = require('fs'); // module to  acsess the filesystem , fs is object that access file system functtions
const http = require('http'); // module to create http server
const url = require('url');
/////////////////////////////////////////

// FILES

// Blocking, Synchronous way
//const textIn = fs.readFileSync('./txt/input.txt', 'utf-8'); // access fs.funcName
// filepath, encoding type so that we dont get buffer so utf returns text

// console.log(textIn);

// const textOut = `This is what we know about avocado: ${textIn}. \nCreated on ${Date.now()}`; // \n new line

// fs.writeFileSync('./txt/output.txt', textOut, 'utf-8'); // write to file

// console.log('Done!');

// Non-Blocking, Asynchronous way

// call back hell
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('Error');
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('your file has been written 😊');
//       });
//     });
//   });
// }); // after reading the file will call the callback function that has to paramtters , first one error incase of any and second one is data

// console.log('will read file'); // this gets logged first

/////////////////////////////////////////

// SERVERS

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //using the sync version cause this top level code only executes once at the begining of the app
const dataObj = JSON.parse(data); // convert string to js object/ array

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === '/' || pathName === '/overview') {
    res.end('this is the overview');
  } else if (pathName === '/product') {
    res.end('this is the product');
  } else if (pathName === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
    return; // return statement is crucial for avoiding execution of code after the response has already been sent.
  } else
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello',
    }); //Header must be set before sending response
  res.end('<h1>this page cannot be found</h1>');
});

server.listen(3000, () => {
  // event loop starts here it doenot exit
  console.log('Server is running on port 3000');
});
