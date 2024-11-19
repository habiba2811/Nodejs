const fs = require('fs'); // Require the built-in 'fs' module for file system operations.
const superagent = require('superagent'); // Require the 'superagent' module for making HTTP requests.

// A function that wraps 'fs.readFile' in a Promise for asynchronous file reading.
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('error reading file'); // If there's an error, reject the promise with an error message.
      resolve(data); // If successful, resolve the promise with the data.
    });
  });
};

// A function that wraps 'fs.writeFile' in a Promise for asynchronous file writing.
const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('error writing file'); // If there's an error, reject the promise with an error message.
      resolve('success'); // If successful, resolve the promise with a success message.
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`breed: ${data}`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);
    await writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
    console.log('All tasks completed successfully!');
  } catch (err) {
    console.log(err.message);
    throw err;
  }
  return '2:READY';
};
// 1:will get dog pics
// Promise { <pending> }
// 2: done getting dog pics
// breed: retriever
// https://images.dog.ceo/breeds/retriever-flatcoated/n02099267_1095.jpg
// All tasks completed successfully!
// console.log('1:will get dog pics');
// const x = getDogPic();
// console.log(x);
// console.log('3: done getting dog pics');

console.log('1:will get dog pics');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('3: done getting dog pics');
  })
  .catch((err) => console.log('   ERROR'));

// Begin the promise chain by reading the 'dog.txt' file.
// readFilePro(`${__dirname}/dog.txt`) // '__dirname' ensures the path is relative to the current directory.
//   .then((data) => {
//     console.log(`breed: ${data}`); // Log the breed name read from the file.
//     // Use 'superagent' to fetch a random dog image URL for the given breed.
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message); // Log the random dog image URL fetched from the API.
//     // Write the image URL to a new file named 'dog-img.txt'.
//     return writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
//   })
//   .then(() => {
//     console.log('All tasks completed successfully!'); // Log a success message after writing the file.
//   })
//   .catch((err) => {
//     console.log(err.message); // Catch and log any errors that occur in the promise chain.
//   });
