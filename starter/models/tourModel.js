const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    // create schema to create model with documents for crud operations
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have at most 40 characters"],
      minlength: [10, "A tour name must have at least 10 characters"],
      // validate: [validator.isAlpha, "Tour name must only contain characters"], // validator package is used to validate data input
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation, doesnt work on update
          return val < this.price; // 100 < 200
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true, // remove all white space in beggining and end
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    imageCover: {
      type: String, // the path to the image
      required: [true, "A tour must have a cover image"],
    },
    images: [String], // multiple images array of strings
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // don't show this field in response
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: { virtuals: true }, // convert virtual properties to json
    toObject: { virtuals: true }, // convert virtual properties to object
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  // function not an arrow function because we need to use (this)
  // virtual property will be created each time we get data out of db
  // we cant use the virtual property in query because it is not part of db
  return this.duration / 7;
});

//Document MIDDLEWARE mongo : run before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre("save", function (next) {
//   console.log("Will save document...");
//   next();
// });

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE , find hook makes it query mw not document mw, this points to query not doc
tourSchema.pre(/^find/, function (next) {
  // regex to match any find method
  this.find({ secretTour: { $ne: true } }); // ne = not equal
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  // we have access to all documents returned from query
  console.log(doc);
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // add stage to beginning of pipeline ,unshift adds to beggining
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
