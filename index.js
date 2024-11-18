const fs = require('fs'); // module to  acsess the filesystem , fs is object that access file system functtions
const http = require('http'); // module to create http server
const url = require('url');
const slugify = require('slugify'); // slug is the last part of url contain a unique string that identify recourse that the website is displaying
const replaceTemplate = require('./modules/replaceTemplate');
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

// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //using the sync version cause this top level code only executes once at the begining of the app
const dataObj = JSON.parse(data); // convert string to js object/ array
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
console.log(slugify('Fresh Avocado', { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true); // passing true to parse query to obj

  // OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join(''); // using map to loop through array and return new array object , map accepts a callback function with argument of currrent element of the loop and what returns will be saved in the array with the same position, join will join all elements of the array into a string

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
    return;
    // PRODUCTS PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    return;
    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
    return; // return statement is crucial for avoiding execution of code after the response has already been sent.
    // NOT FOUND
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
