const EventEmitter = require('events');
const http = require('http');
class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

// Create a new instance of the EventEmitter class.
myEmitter.on('newSale', () => {
  // Register an event listener for the 'newSale' event.
  // The callback function will execute whenever the 'newSale' event is emitted.
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Customer name: Jonas');
});

myEmitter.on('newSale', (stock) => {
  console.log(`there are now stock of ${stock}`);
});
// Emit (trigger) the 'newSale' event.
myEmitter.emit('newSale', 9);

// they run squencely

/////////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received!');
});

server.on('request', (req, res) => {
  res.end('Another Request');
  return;
});

server.on('close', () => {
  console.log('Server closed');
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
