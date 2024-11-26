const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

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
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // pass error to global error handler
});

app.use(globalErrorHandler);

module.exports = app;
