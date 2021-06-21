const Contact = require("../model/contact");

const getAll = async (userId, query) => {
  const { limit = 20, offset = 0 } = query;
  const optionsSearch = { owner: userId };
  const results = await Contact.paginate(optionsSearch, {
    limit,
    offset,
    populate: {
      path: "owner",
      select: "name email subscription",
    },
  });
  return results;
};

const getById = async (userId, contactId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: "owner",
    select: "name email subscription",
  });
  return result;
};

const removeContact = async (userId, contactId) => {
  const result = await Contact.findOneAndDelete({
    _id: contactId,
    owner: userId,
  }).populate({
    path: "owner",
    select: "name email subscription",
  });
  return result;
};

const addContact = async (userId, body) => {
  const result = await Contact.create({ owner: userId, ...body });
  return result;
};

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true }
  ).populate({
    path: "owner",
    select: "name email phone",
  });
  return result;
};

const updateStatusContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true }
  ).populate({
    path: "owner",
    select: "name email phone",
  });
  return result;
};

module.exports = {
  getAll,
  getById,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
};
