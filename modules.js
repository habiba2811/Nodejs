// console.log(arguments);
// console.log(require('module').wrapper);

// module.exports
const C = require('./test-module-1');
const calc1 = new C();
console.log(calc1.add(7, 3));

// exports
//const calc2 = require('./test-module-2');
const { add, subtract } = require('./test-module-2');
console.log(add(7, 3));
//console.log(calc2.add(7, 3));

// caching

require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
// Hello from module
// log this text => cach
// log this text
// log this text
