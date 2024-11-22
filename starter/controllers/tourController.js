const fs = require("fs");
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../controllers/utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty"; // fields to be returned
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate(); // create new instance of APIFeatures class

    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: tours,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
  // const query =  Tour.find() we can chain because its a query
  //   .where("duration")
  //   .equals(5)
  //   .where("difficulty")
  //   .equals("easy");
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // Tour.findOne({ _id: req.params.id })
    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "No tour found!",
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // the new updated document will be sent in the response
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        updatedTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "No tour found!",
    });
  }
};

exports.deleteTour = async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  try {
    res.status(204).json({
      status: "success",
      data: "null",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: "No tour found!",
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({})
    // newTour.save()
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
