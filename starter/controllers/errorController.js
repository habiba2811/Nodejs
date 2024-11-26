module.exports = (err, req, res, next) => {
  // global error handler
  err.statusCode = err.statusCode || 500; // default status code
  err.status = err.status || "error"; // default status

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
