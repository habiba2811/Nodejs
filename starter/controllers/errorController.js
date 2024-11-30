const AppError = require("./../utils/appError");
handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0]; // Get the first key (field name) in keyValue
  const value = err.keyValue ? err.keyValue[field] : "unknown";
  const message = `Duplicate field value: "${value}". Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message); // Get all error messages in an array
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  const message = "Invalid token. Please log in again!";
  return new AppError(message, 401);
};

const handleJWTExpiredError = () => {
  const message = "Your token has expired. Please log in again!";
  return new AppError(message, 401);
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("ERROR 💥", err);
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
module.exports = (err, req, res, next) => {
  // global error handler
  err.statusCode = err.statusCode || 500; // default status code
  err.status = err.status || "error"; // default status

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign({}, err);
    error.name = err.name;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, res);
  }
};
