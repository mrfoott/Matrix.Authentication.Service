const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const account = require("../Models/account");
const activityLog = require("../Models/activityLog");
const { default: axios } = require("axios");
const springServiceUrl = require("../Utils/urlRequest");

let refreshTokenArr = [];
const authController = {
  // Register controller
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const existedUser = await account.findOne({ email: req.body.email });
      if (existedUser) {
        return res.status(400).json({ any: "user has been existed!!" });
      }
      await axios
        .post(
          "http://localhost:8081/api/notify/v1/verify/comfirmregister",
          {
            email: req.body.email,
            code: req.body.verifyCode,
          },
          {}
        )
        .then((res) => console.log(res.data));

      const user = {
        user_id: uuidv4(),
        email: req.body.email,
        password: password,
        verifyCode: req.body.verifyCode,
      };
      console.log(user);
      const result = await new account(user).save();
      const body = {
        id: user.user_id,
        userEmail: user.email,
        password: user.password,
        userPhone: req.body.phone,
        fullName: req.body.fullname,
        membershipPoint: 0,
        avatar: "https://via.placeholder.com/150",
        roleId: 1,
        membershipId: 1,
      }
      console.log(body);
      await axios.post("http://localhost:8080/api/v1/admin/users", {
        id: user.user_id,
        userEmail: user.email,
        password: user.password,
        userPhone: req.body.phone,
        fullName: req.body.fullname,
        membershipPoint: 0,
        avatar: "link123",
        roleId: 1,
        membershipId: 1,
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //GenerateToken
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.user_id,
        role_id: user.role_id,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "10m",
      }
    );
  },
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.user_id,
        role: user.role_id,
      },
      process.env.JWT_REFRESH_KEY,
      {
        expiresIn: "2h",
      }
    );
  },
  //login
  loginUser: async (req, res) => {
    try {
      const user = await account.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(404)
          .json({ status: 404, any: "wrong email or password" });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res
          .status(404)
          .json({ status: 404, any: "wrong email or password" });
      }

      if (user && validPassword) {
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokenArr.push(refreshToken);
        //check ip and send email warning if user login on new device
        const userLog = await activityLog.find({ user_id: user.user_id });
        let userAgentArray = [];
        for (let i = 0; i < userLog.length; i++) {
          const ele = userLog[i];
          userAgentArray.push(ele.userAgent);
        }
        const timestamp = new Date();
        if (!userAgentArray.includes(req.body.userAgent)) {
          console.log("đăng nhập trên thiết bị mới");
          await axios.post(
            `http://localhost:8081/api/notify/v1/verify/loginonnewdevice`,
            {
              email: req.body.email,
              ipInfo: req.body.ipInfo,
              userAgent: req.body.userAgent,
              timestamp: timestamp.toString(),
            },
            {}
          );
        }
        console.log(user.user_id);
        console.log(springServiceUrl.getUserById(user.user_id));
        const springUserData = await axios.get(springServiceUrl.getUserById(user.user_id))
        console.log(springUserData.data);

        // save a new log
        const a_log = await new activityLog({
          user_id: user.user_id,
          ipInfo: req.body.ipInfo,
          userAgent: req.body.userAgent,
          login_time: new Date(),
        }).save();
        res.cookie("refreshToken", refreshToken, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: false,
        });
        const { password, ...orther } = user._doc;
        const { createdAt, updatedAt, isDeleted, ...springData } = springUserData.data;
        res.status(200).json({ ...orther, ...springData, accessToken });
      }
    } catch (error) {
      res.status(500).json("error");
    }
  },
  //RequestRefreshToken
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json("You're not authenticated");
    }
    if (!refreshTokenArr.includes(refreshToken)) {
      res.status(403).json("Refresh token is not valid");
    }
    refreshTokenArr = refreshTokenArr.filter((token) => token !== refreshToken);
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        res.status(500).json(err);
      }
      const newAccessToken = authController.generateAccessToken(user);
      const newRefreshToken = authController.generateRefreshToken(user);
      refreshTokenArr.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  },
  //logout
  logoutUser: async (req, res) => {
    if (!req.cookies.refreshToken) {
      res.status(403).json("You're not authenticated");
    }
    res.clearCookie("refreshToken");
    refreshTokenArr = refreshTokenArr.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Logout successfully!");
  },
  //Find user for notification
  authFindAccountById: async (req, res) => {
    try {
      const existedUser = await account.findOne({ email: req.params.email });
      if (existedUser) {
        return res.status(200).json({ existed: true });
      }
      return res.status(404).json({ existed: false });
    } catch (error) {
      res.status(500).json({ any: "Server error" });
    }
  },
};

module.exports = authController;
