const { HttpCode } = require("../helpers/constants");
const Contacts = require("../repositories/contacts");

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { docs: contacts, ...rest } = await Contacts.getAll(
      userId,
      req.query
    );
    return res.status(HttpCode.OK).json({
      status: "Success",
      code: HttpCode.OK,
      data: { contacts, ...rest },
    });
  } catch (e) {
    next(e);
  }
};

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getById(userId, req.params.id);
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: "Success", code: HttpCode.OK, data: { contact } });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "Error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (e) {
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact(userId, req.body);
    return res
      .status(HttpCode.CREATED)
      .json({ status: "Success", code: HttpCode.CREATED, data: { contact } });
  } catch (e) {
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.id);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: "Success",
        code: HttpCode.OK,
        message: "Contact was deleted",
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "Error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      userId,
      req.params.id,
      req.body
    );
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: "Success", code: HttpCode.OK, data: { contact } });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "Error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (e) {
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateStatusContact(
      userId,
      req.params.id,
      req.body
    );
    if (contact) {
      res
        .status(HttpCode.OK)
        .json({ status: "Success", code: HttpCode.OK, data: { contact } });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "Error",
      code: HttpCode.NOT_FOUND,
      message: "Not found",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
