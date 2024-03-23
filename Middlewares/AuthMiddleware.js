const jwt = require("jsonwebtoken")
require("dotenv").config()

const middleware = {
    verifyAccessToken: (req, res) => {
        const accessToken = req.headers.token

        if (accessToken) {
            jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is invalid!")
                } 
                req.user = user
                return res.status(200).json({status: "Authenticated"})
            })
        } else {
            return res.status(401).json("You haven't logged in yet!")
        }
    },
    verifyAccessTokenAdmin: (req, res) => {
        middleware.verifyAccessToken(req, res, () => {
            if (req.user.role_id == 1) {
                return res.status(200).json({status: "Authenticated"})
            } else {
                return res.status(403).json("You're not allowed!")
            }
        })
    },
    verifyAccessTokenSuperAdmin: (req, res) => {
        middleware.verifyAccessToken(req, res, () => {
            if (req.user.role_id == 2) {
                return res.status(200).json({status: "Authenticated"})
            } else {
                return res.status(403).json("You're not allowed!")
            }
        })
    }
}

module.exports = middleware