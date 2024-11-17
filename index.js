const fs = require('fs'); // module to  acsess the filesystem , fs is object that access file system functtions
const http = require('http'); // module to create http server

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

const server = http.createServer((req, res) => {
  // req has access to req url etc
  res.end('Hello from server');
});

server.listen(3000, () => {
  // event loop starts here it doenot exit
  console.log('Server is running on port 3000');
});
