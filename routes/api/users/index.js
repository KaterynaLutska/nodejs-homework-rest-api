const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const { validationCreateUser } = require("./validation");
const guard = require("../../../helpers/guard");

router.use((req, res, next) => {
  next();
});

router
  .post("/signup", validationCreateUser, ctrl.signup)
  .post("/login", validationCreateUser, ctrl.login)
  .post("/logout", guard, ctrl.logout);

module.exports = router;
