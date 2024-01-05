const jwt = require("jsonwebtoken")

const middleware = {
    verifyAccessToken: (req, res, next) => {
        const accessToken = req.headers.token

        if (accessToken) {
            jwt.verify(accessToken, process.env.SECRET_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is invalid!")
                } else {
                    req.user = user
                    next()
                }
            })
        } else {
            return res.status(401).json("You haven't logged in yet!")
        }
    },
    verifyAccessTokenAdmin: (req, res, next) => {
        middleware.verifyAccessToken(req, res, () => {
            if (req.user.role_id == 1) {
                next()
            } else {
                return res.status(403).json("You're not allowed!")
            }
        })
    }
}

module.exports = middleware