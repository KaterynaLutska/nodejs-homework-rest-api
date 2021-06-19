const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/users");
const { validationCreateUser } = require("./validation");
const guard = require("../../../helpers/guard");
const upload = require("../../../helpers/upload");

router.use((req, res, next) => {
  next();
});

router
  .post("/signup", validationCreateUser, ctrl.signup)
  .post("/login", validationCreateUser, ctrl.login)
  .post("/logout", guard, ctrl.logout)
  .patch("/avatars", guard, upload.single("avatar"), ctrl.avatars);

module.exports = router;
