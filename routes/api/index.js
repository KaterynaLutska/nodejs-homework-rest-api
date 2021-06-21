const express = require("express");
const router = express.Router();

router
  .use("/users", require("./users"))
  .use("/contacts", require("./contacts"));

module.exports = router;
