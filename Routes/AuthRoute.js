const route = require("express").Router()
const authController = require("../Controllers/AuthController")
const middleware = require("../Middlewares/AuthMiddleware")

//LOGIN
route.post("/register", authController.registerUser)
//REGISTER
route.post("/login", authController.loginUser)
//REFRESH TOKEN
route.post("/refreshtoken", authController.requestRefreshToken)
// LOGOUT
route.post("/logout", authController.logoutUser)

//AUTH FIND ACCOUNT BY ID
route.get("/findaccount/:email", authController.authFindAccountById)

//MIDDLEWARE ACCESS TOKEN
route.get("/middleware", middleware.verifyAccessToken)

module.exports = route
