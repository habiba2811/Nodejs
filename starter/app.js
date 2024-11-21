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
  // it applies to all requests because the order of the code
  console.log("hello from middleware 🙌");
  next(); // call next to so the next middleware is called
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //current time of request
  next();
});

// 2) routes

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
