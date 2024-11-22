const fs = require("fs");
const Tour = require("./../models/tourModel");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty"; // fields to be returned
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString }; //shallow copy of query object
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]); // delete fields from query object

    // 1) ADVANCED FILTERING
    // { duration: { $gt: 5 } }
    let queryStr = JSON.stringify(queryObj); // convert obj to string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // replace all gte, lte, gt, lt with $gte, $lte, $gt, $lt (lt = less than, gt = greater than, lte = less than or equal to, gte = greater than or equal to) \b is a word boundary /g is to replace all matches
    this.query.find(JSON.parse(queryStr));
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // sort by createdAt in descending order
    }
  }
}

exports.getAllTours = async (req, res) => {
  try {
    // // BUILD QUERY
    // // 1A) FILTERING
    // // { duration: 5, difficulty: "easy" }

    // const queryObj = { ...req.query }; //shallow copy of query object
    // const excludedFields = ["page", "sort", "limit", "fields"];
    // excludedFields.forEach((el) => delete queryObj[el]); // delete fields from query object

    // // console.log(req.query, queryObj); // obj with data from query string

    // // 1) ADVANCED FILTERING
    // // { duration: { $gt: 5 } }
    // let queryStr = JSON.stringify(queryObj); // convert obj to string
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // replace all gte, lte, gt, lt with $gte, $lte, $gt, $lt (lt = less than, gt = greater than, lte = less than or equal to, gte = greater than or equal to) \b is a word boundary /g is to replace all matches
    // console.log(JSON.parse(queryStr));

    // // queryObj = JSON.parse(queryStr); // convert string to obj
    // let query = Tour.find(JSON.parse(queryStr)); // returns a query

    // 2) SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("-createdAt"); // sort by createdAt in descending order
    // }

    // 3) FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // exclude __v field
    }

    // 4) PAGINATION
    const page = req.query.page * 1 || 1; // page 1 by default
    const limit = req.query.limit * 1 || 100; // 100 by default
    const skip = (page - 1) * limit; // 0, 100, 200
    query = query.skip(skip).limit(limit); // skip 0, 100, 200 and limit to 100, 100, 100

    if (req.query.page) {
      const numTours = await Tour.countDocuments(); // count number of documents
      if (skip >= numTours) throw new Error("This page does not exist"); // throw error if page does not exist
    }
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query); // create new instance of APIFeatures class
    features.filter(); // call filter method
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
