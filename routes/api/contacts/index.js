const express = require("express");
const router = express.Router();
const ctrl = require("../../../controllers/contacts");
const guard = require("../../../helpers/guard");

const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateStatusContact,
  validateMongoId,
} = require("./validation");

router.use((req, res, next) => {
  next();
});

router
  .get("/", guard, ctrl.getAll)
  .post("/", guard, validationCreateContact, ctrl.addContact);

router
  .get("/:id", guard, validateMongoId, ctrl.getById)
  .delete("/:id", guard, validateMongoId, ctrl.removeContact)
  .put(
    "/:id",
    guard,
    validateMongoId,
    validationUpdateContact,
    ctrl.updateContact
  );

router.patch(
  "/:id/favorite",
  guard,
  validationUpdateStatusContact,
  ctrl.updateStatusContact
);

module.exports = router;
