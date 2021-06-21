const Users = require("../repositories/users");
const { HttpCode } = require("../helpers/constants");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
//const UploadAvatarService = require("../services/local-upload");
const UploadAvatarService = require("../services/cloud-upload");

const EmailService = require("../services/email");
const {
  CreateSenderNodemailer,
  CreateSenderSendGrid,
} = require("../services/email-sender");

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
        ResponseBody: { message: "Email is already used" },
      });
    }

    const { name, email, subscription, avatar, verifyToken } =
      await Users.createUser(req.body);

    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid()
        // new CreateSenderNodemailer()
      );
      await emailService.sendVerifyEmail(verifyToken, email, name);
    } catch (error) {
      console.log("Error", error.message);
    }

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
    if (!user || !isValidPassword || !user.verify) {
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

const verify = async (req, res, necx) => {
  try {
    const user = await Users.findByVerifyToken(req.params.token);
    if (user) {
      await Users.updateTokenVerify(user.id, true, null);
      return res.json({
        Status: "Success",
        CODE: HttpCode.OK,
        data: { message: "Success!" },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      Status: "Bad Request",
      CODE: HttpCode.BAD_REQUEST,
      data: { message: "Verification token isn`t valid" },
    });
  } catch (err) {
    console.log(err.massege);
  }
};

const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    console.log(user);
    if (user) {
      const { name, email, verify, verifyToken } = user;
      if (!verify) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          //new CreateSenderNodemailer()
          new CreateSenderSendGrid()
        );
        await emailService.sendVerifyEmail(verifyToken, email, name);
        return res.json({
          Status: "Success",
          CODE: HttpCode.OK,
          data: { message: "Resubmitted success!" },
        });
      }
      return res.status(HttpCode.CONFLICT).json({
        Status: "Conflict",
        Code: HttpCode.CONFLICT,
        ResponseBody: { message: "Email has been already verified" },
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: "Not Found",
      code: HttpCode.NOT_FOUND,
      message: "User not Found",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  avatars,
  verify,
  repeatEmailVerification,
};
