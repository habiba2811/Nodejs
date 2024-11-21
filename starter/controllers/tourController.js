const fs = require("fs");
const Tour = require("./../models/tourModel");

exports.getAllTours = (req, res) => {
  // good to have versions of api
  res.status(200).json({
    requestTime: req.requestTime,
    // results: tours.length,
    // status: "success",
    // data: tours,
  });
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;

  console.log(req.params);
  // const tour = tours.find((el) => el.id === id);

  // res.status(200).json({
  //   status: "success",
  //   data: tour,
  // });
};
exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // const updatedTour = { ...tour, ...req.body }; // spread operator to merge the 2 objects
  // tours[tours.findIndex((el) => el.id === id)] = updatedTour;
  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     tour: updatedTour,
  //   },
  // });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    message: "null",
  });
};

exports.createTour = (req, res) => {
  //     res.status(201).json({
  //       status: "success",
  //       data: {
  //         tour: newTour,
  //        },
  //     });
};
