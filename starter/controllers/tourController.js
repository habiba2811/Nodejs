const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is ${val}`);
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      // after sending the response the function then returns and execute the next() function
      status: 'fail',
      message: 'not found',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  // good to have versions of api
  res.status(200).json({
    requestTime: req.requestTime,
    results: tours.length,
    status: 'success',
    data: tours,
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;

  console.log(req.params);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: tour,
  });
};
exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  const updatedTour = { ...tour, ...req.body }; // spread operator to merge the 2 objects
  tours[tours.findIndex((el) => el.id === id)] = updatedTour;
  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    message: 'null',
  });
};

exports.createTour = (req, res) => {
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
