const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt")
const account = require("../Models/account");
const activityLog = require("../Models/activityLog");

let refreshTokenArr = [];
const authController = {
    // register controller
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(req.body.password, salt)
            const existedUser = await account.findOne({ email: req.body.email })
            if (existedUser) {
                return res.status(400).json({ any: "user has been existed!!" })
            }
            const user = {
                user_id: uuidv4(),
                email: req.body.email,
                password: password,
            }
            const result = await new account(user).save()
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    //generateToken
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.user_id,
            role_id: user.role_id
        },
            process.env.JWT_ACCESS_KEY, {
            expiresIn: "10m"
        })
    },
    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user.user_id,
            role: user.role_id
        }, process.env.JWT_REFRESH_KEY, {
            expiresIn: "2h"
        })
    },
    //login
    loginUser: async (req, res) => {
        try {
            const user = await account.findOne({ email: req.body.email })
            if (!user) {
                return res.status(404).json({ status: 404, any: "wrong email or password" })
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) {
                return res.status(404).json({ status: 404, any: "wrong email or password" })
            }

            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user)
                const refreshToken = authController.generateRefreshToken(user)
                refreshTokenArr.push(refreshToken)
                const a_log = await new activityLog({
                    user_id: user.user_id,
                    ipInfo: req.body.ipInfo,
                    userAgent: req.body.userAgent,
                    login_time: new Date(),
                }).save()
                //check ip and send email warning if user login on new device

                res.cookie("refreshToken", refreshToken, {
                    path: "/",
                    httpOnly: true,
                    sameSite: "strict",
                    secure: false
                })
                const { password, ...orther } = user._doc
                res.status(200).json({ ...orther, a_log, accessToken })
            }
        } catch (error) {
            res.status(500).json("error")
        }
    },
    //requestRefreshToken
    requestRefreshToken: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).json("You're not authenticated")
        }
        if (!refreshTokenArr.includes(refreshToken)) {
            res.status(403).json("Refresh token is not valid")
        }
        refreshTokenArr = refreshTokenArr.filter((token) => token !== refreshToken);
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                res.status(500).json(err)
            }
            const newAccessToken = authController.generateAccessToken(user)
            const newRefreshToken = authController.generateRefreshToken(user)
            refreshTokenArr.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            res.status(200).json({ accessToken: newAccessToken })
        })
    },
    //logout
    logoutUser: async (req, res) => {
        if (!req.cookies.refreshToken) {
            res.status(403).json("You're not authenticated")
        }
        res.clearCookie("refreshToken");
        refreshTokenArr = refreshTokenArr.filter(token => token !== req.cookies.refreshToken)
        res.status(200).json("Logout successfully!")
    }
}

module.exports = authController