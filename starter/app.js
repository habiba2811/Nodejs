const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const app = express();

// 1) middlewares

app.use(morgan('dev')); // GET /api/v1/tours 200 5.009 ms - 8673

app.use(express.json()); // express.json is middleware function that modify the incomming request data used for the post request
app.use((req, res, next) => {
  // it applies to all requests because the order of the code
  console.log('hello from middleware 🙌');
  next(); // call next to so the next middleware is called
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //current time of request
  next();
});

const port = 3000;
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) route handlers
const getAllTours = (req, res) => {
  // good to have versions of api
  res.status(200).json({
    requestTime: req.requestTime,
    results: tours.length,
    status: 'success',
    data: tours,
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'not found',
    });
  }
  res.status(200).json({
    status: 'success',
    data: tour,
  });
};
const updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  if (!tour)
    return res.status(404).json({
      status: 'fail',
      message: 'not found',
    });
  const updatedTour = { ...tour, ...req.body }; // spread operator to merge the 2 objects
  tours[tours.findIndex((el) => el.id === id)] = updatedTour;
  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'not found',
    });
  }
  res.status(204).json({
    status: 'success',
    message: 'null',
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // the body we sent + new id created , use obj.assign to create a new obj be merging 2 existing obj ( id, req.body)

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // string the tours object
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// 3) routes

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').post(createTour).get(getAllTours);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .delete(deleteTour)
  .patch(updateTour);

// 4) start server

app.listen(port, () => {
  console.log(`app listening on ${port}`);
});
