const express = require("express");
const morgan = require("morgan");

const app = express();
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// 1) middlewares

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} // GET /api/v1/tours 200 5.009 ms - 8673

app.use(express.json()); // express.json is middleware function that modify the incomming request data used for the post request
app.use(express.static(`${__dirname}/public`)); // express.static for serving static html files

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //current time of request
  next();
});

// 2) routes

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.all("*", (req, res, next) => {
  // catch all route that passed the above routes and wasnt defined
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = "fail";
  err.statusCode = 404;
  next(err); // pass error to global error handler
});

app.use((err, req, res, next) => {
  // global error handler
  err.statusCode = err.statusCode || 500; // default status code
  err.status = err.status || "error"; // default status

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
