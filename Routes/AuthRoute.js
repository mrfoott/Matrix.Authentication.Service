const route = require("express").Router()
const authController = require("../Controllers/AuthController")

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

module.exports = route
