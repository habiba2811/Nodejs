const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  // event listeners
  // catch uncaught exceptions
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // exit with failure 1-> error , 0 -> success
  });
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful"));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app listening on ${port}`);
});

// event handler for unhandled promise rejections
process.on("unhandledRejection", (err) => {
  // event listeners
  // catch unhandled promise rejections
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1); // exit with failure 1-> error , 0 -> success
  });
});
