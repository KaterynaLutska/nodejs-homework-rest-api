const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");

const readData = async () => {
  const data = await fs.readFile(
    path.join(__dirname, "contacts.json"),
    "utf-8"
  );
  return JSON.parse(data);
};

const listContacts = async () => {
  return await readData();
};

const getById = async (contactId) => {
  const data = await readData();
  const [result] = data.filter((el) => el.id === contactId);
  return result;
};

const removeContact = async (contactId) => {
  const data = await readData();

  const index = data.findIndex((el) => el.id === contactId);
  console.log(index);
  if (index !== -1) {
    const result = data.splice(index, 1);

    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(data)
    );
    return result;
  }
  return null;
};

const addContact = async (body) => {
  const id = uuid();
  const record = {
    id,
    ...body,
    ...(body.isOnline ? {} : { isOnline: false }),
  };

  const data = await readData();
  data.push(record);

  await fs.writeFile(
    path.join(__dirname, "contacts.json"),
    JSON.stringify(data)
  );
  return record;
};

const updateContact = async (id, body) => {
  const data = await readData();
  const [contact] = data.filter((el) => el.id === id);
  if (contact) {
    Object.assign(contact, body);
    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(data)
    );
  }
  return contact;
};

module.exports = {
  listContacts,
  getById,
  addContact,
  updateContact,
  removeContact,
};
