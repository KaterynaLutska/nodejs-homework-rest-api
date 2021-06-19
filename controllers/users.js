const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
//const UploadAvatarService = require("../services/local-upload");
const UploadAvatarService = require("../services/cloud-upload");

require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);

    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        Status: "Conflict",
        Code: HttpCode.CONFLICT,
        ResponseBody: { message: "Email in use" },
      });
    }

    const { email, subscription, avatar } = await Users.createUser(req.body);

    return res.status(HttpCode.CREATED).json({
      Status: "Created",
      Code: HttpCode.CREATED,
      ResponseBody: {
        email: email,
        subscription: subscription,
        avatar: avatar,
      },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        Status: "Unauthorized",
        Code: HttpCode.UNAUTHORIZED,
        ResponseBody: { message: "Email or password is wrong" },
      });
    }
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(id, token);
    return res.json({
      Status: "Success",
      CODE: HttpCode.OK,
      ResponseBody: {
        token,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);

    return res.status(HttpCode.NO_CONTENT).json({
      status: "No content",
      code: HttpCode.NO_CONTENT,
      data: {},
    });
  } catch (e) {
    next(e);
  }
};

//* local upload * //
// const avatars = async (req, res, next) => {
//   try {
//     const id = req.user.id;
//     const uploads = new UploadAvatarService(AVATAR_OF_USERS);
//     const avatarUrl = await uploads.saveAvatar({ userId: id, file: req.file });

//     try {
//       await fs.unlink(path.join(AVATAR_OF_USERS, req.user.avatar));
//     } catch (e) {
//       console.log(e.message);
//     }

//     await Users.updateAvatar(id, avatarUrl);
//     return res.json({
//       Status: "Success",
//       CODE: HttpCode.OK,
//       ResponseBody: { avatarUrl },
//     });
//   } catch (e) {
//     next(e);
//   }
// };

//* cloud upload *//

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService();
    const { idCloudAvatar, avatarUrl } = await uploads.saveAvatar(
      req.file.path,
      req.user.idCloudAvatar
    );

    await fs.unlink(req.file.path);
    await Users.updateAvatar(id, avatarUrl, idCloudAvatar);
    return res.json({
      Status: "Success",
      CODE: HttpCode.OK,
      data: { avatarUrl },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { signup, login, logout, avatars };
