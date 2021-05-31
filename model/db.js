const mongoose = require("mongoose");
require("dotenv").config({ path: "./routes/.env" });

const uriDb = process.env.URI_DB;

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 5,
});

mongoose.connection.on("connected", () => {
  console.log(`Database connection successful open on: ${uriDb}`);
});

mongoose.connection.on("error", (e) => {
  console.log(`Error mongoose connection ${e.message}`);
});

mongoose.connection.on("disconnected", (e) => {
  console.log(`Mongoose connection ${e.message}`);
});

process.on("SIGINT", async () => {
  mongoose.connection.close(() => {
    console.log("Connection to DB terminated");
    process.exit(1);
  });
});

module.exports = db;
