const route = require("express").Router()
const authController = require("../Controllers/AuthController")

//LOGIN
route.post("/register", authController.registerUser)
//REGISTER
route.post("/login", authController.loginUser)
//REFRESH TOKEN
route.post("/refreshtoken", authController.requestRefreshToken)


module.exports = route
