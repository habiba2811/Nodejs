const fs = require('fs'); // module to  acsess the filesystem , fs is object that access file system functtions

const textIn = fs.readFileSync('./txt/input.txt', 'utf-8'); // access fs.funcName
// filepath, encoding type so that we dont get buffer so utf returns text

console.log(textIn);

const textOut = `This is what we know about avocado: ${textIn}. \nCreated on ${Date.now()}`; // \n new line

fs.writeFileSync('./txt/output.txt', textOut, 'utf-8'); // write to file

console.log('Done!');
