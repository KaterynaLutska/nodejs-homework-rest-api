const mongoose = require("mongoose");
const gr = require("gravatar");
const bcrypt = require("bcryptjs");
const { Subscription } = require("../helpers/constants");
const SALT_WORK_FACTOR = 8;

//const { STARTER, PRO, BUSINESS } = Object.values(Subscription);

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate(value) {
      const re = /\S+@\S+\.\S+/g;
      return re.test(String(value).toLowerCase());
    },
  },
  subscription: {
    type: String,
    enum: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: function () {
      return gr.url(this.email, { s: "250" }, true);
    },
  },
  idCloudAvatar: {
    type: String,
    default: null,
  },
});

// password encryption //
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// password check //
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
