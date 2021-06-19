const request = require("supertest");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { HttpCode } = require("../helpers/constants");

const app = require("../app");
const db = require("../model/db");
const User = require("../model/user");
const Users = require("../repositories/users");
const { newContact, newUser } = require("./data/data");
const Contact = require("../model/contact");

describe("Test route contacts", () => {
  let user, token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUser.email });
    user = await User.create(newUser);
    const SECRET_KEY = process.env.SECRET_KEY;
    const issueToken = (payload, secret) => jwt.sign(payload, secret);
    token = issueToken({ id: user._id }, SECRET_KEY);
    await Users.updateToken(user._id, token);
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUser.email });
    await mongo.disconnect();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
  });

  describe("GET request", () => {
    it("should return status 200 get all contacts", async () => {
      const response = await request(app)
        .get("/api/contacts")
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();
      expect(response.body.data.contacts).toBeInstanceOf(Array);
    });
    it("should return status 200 get contacts by id", async () => {
      const contact = await Contact.create({
        ...newContact,
        owner: user._id,
      });
      const response = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(HttpCode.OK);
      expect(response.body).toBeDefined();
      expect(response.body.data.contact).toHaveProperty("id");
      expect(response.body.data.contact.id).toBe(String(contact._id));
    });
    it("should return status 200 get all contacts without id", async () => {
      const fakeId = "60ad371ee5c5131384447a75";
      const response = await request(app)
        .get(`/api/contacts/${fakeId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(HttpCode.NOT_FOUND);
      expect(response.body).toBeDefined();
    });
  });

  describe("POST request", () => {
    it("should return status 201 create contact", async () => {
      const response = await request(app)
        .post("/api/contacts")
        .set("Authorization", `Bearer ${token}`)
        .send(newContact)
        .set("Accept", "application/json");

      expect(response.status).toEqual(HttpCode.CREATED);
      expect(response.body).toBeDefined();
    });
  });
});
