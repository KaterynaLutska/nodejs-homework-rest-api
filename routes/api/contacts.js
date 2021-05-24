const express = require("express");
const router = express.Router();
const Contacts = require("../../model");
const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateStatusContact,
} = require("../api/validation");

router.use((req, res, next) => {
  next();
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({ status: "Success", code: 200, data: { contacts } });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const contact = await Contacts.getById(req.params.id);
    if (contact) {
      return res.json({ status: "Success", code: 200, data: { contact } });
    }
    return res.json({ status: "Error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
});

router.post("/", validationCreateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: "Success", code: 201, data: { contact } });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.id);
    if (contact) {
      return res.json({
        status: "Success",
        code: 200,
        message: "Contact was deleted",
      });
    }
    return res.json({ status: "Error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
});

router.put("/:id", validationUpdateContact, async (req, res, next) => {
  try {
    const contacts = await Contacts.updateContact(req.params.id, req.body);
    if (contacts) {
      return res.json({ status: "success", code: 200, data: { contacts } });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/:id/online",
  validationUpdateStatusContact,
  async (req, res, next) => {
    try {
      const contacts = await Contacts.update(req.params.id, req.body);
      if (contacts) {
        return res.json({ status: "success", code: 201, data: { contacts } });
      }
      return res.json({ status: "error", code: 404, message: "Not founder" });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
