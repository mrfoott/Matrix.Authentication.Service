const User = require("../Models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const authController = {
    registerUser: async(req, res) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(req.body.password, salt)
            const user = {
                email: req.body.email,
                password: password,
            }
            console.log(user);
            User.registerUser(user, (error, result) => {
                if (error) {
                    throw error
                } else {
                    res.status(200).json(result)
                }
            })
        } catch (error) {
            res.status(500).json(error)
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user.id,
            role_id: user.role_id
        }), process.env.SECRET_KEY, {
            expiresIn: "2h"
        }
    },
    loginUser: async(req, res) => {
        try {
            const user = {
                email: req.body.email
            }
            User.loginUser(user, async(error, result) => {
                if (error) {
                    throw error
                } else if (!result[0]) {
                    res.status(404).json("Wrong email or password!!!")
                    return
                }
                const validEmail = await result[0].email
                const validPassword = await bcrypt.compare(req.body.password, result[0].password)
                if (!validPassword) {
                    res.status(404).json("Wrong email or password!!!")
                    return
                }
                if (validEmail && validPassword) {
                    const accessToken = authController.generateAccessToken(result[0])
                    const { password, ...other } = result[0]
                    res.status(200).json({ ...other, accessToken })
                }
            })

        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = authController