const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateStatusContact,
  validateMongoId,
} = require("../api/validation");

router.use((req, res, next) => {
  next();
});

router
  .get("/", ctrl.getAll)
  .post("/", validationCreateContact, ctrl.addContact);

router
  .get("/:id", validateMongoId, ctrl.getById)
  .delete("/:id", validateMongoId, ctrl.removeContact)
  .put("/:id", validateMongoId, validationUpdateContact, ctrl.updateContact);

router.patch(
  "/:id/favorite",
  validationUpdateStatusContact,
  ctrl.updateStatusContact
);

module.exports = router;
