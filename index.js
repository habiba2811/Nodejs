const fs = require('fs'); // module to  acsess the filesystem , fs is object that access file system functtions

const textIn = fs.readFileSync('./txt/input.txt', 'utf-8'); // access fs.funcName
// filepath, encoding type so that we dont get buffer so utf returns text

console.log(textIn);
