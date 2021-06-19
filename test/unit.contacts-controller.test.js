const { updateContact, getAll } = require("../controllers/contacts");
const { HttpCode } = require("../helpers/constants");
const Contact = require("../repositories/contacts");
jest.mock("../repositories/contacts");

describe("Unit test controller contacts", () => {
  const req = { user: { id: 1 }, body: {}, params: { id: 1 } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn((data) => data),
  };
  const next = jest.fn();

  it("updateContact contacts exist", async () => {
    const contact = { _id: 3, id: 4, body: {} };

    Contact.updateContact = jest.fn(() => {
      return contact;
    });
    const result = await updateContact(req, res, next);
    expect(result).toBeDefined();

    expect(result.status).toEqual("Success");
    expect(result.code).toEqual(200);
    expect(result.data.contact).toEqual(contact);
  });
  it("updateContact without contacts", async () => {
    Contact.updateContact = jest.fn();
    const result = await updateContact(req, res, next);

    expect(result).toBeDefined();
    expect(result.status).toEqual("Error");
    expect(result.code).toEqual(404);
    expect(result.message).toEqual("Not found");
  });
  it("updateContact contacts: repositiries return Error", async () => {
    Contact.updateContact = jest.fn(() => {
      throw new Error("Ups");
    });
    await updateContact(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  // getAll
  // it("getAll contacts exist", async () => {
  //   const userId = req.user.id;

  //   Contact.getAll = jest.fn(() => {
  //     userId, req.query;
  //   });
  //   const result = await getAll(req, res, next);

  //   expect(result).toBeDefined();
  //   expect(result.status).toEqual("Success");
  //   expect(result.code).toEqual(HttpCode.OK);
  //   expect(result.data.contacts).toEqual(contacts);
  // });
});
