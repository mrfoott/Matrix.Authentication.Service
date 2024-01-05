const route = require("express").Router()
const authController = require("../Controllers/authController")

route.post("/register", authController.registerUser)
route.post("/login", authController.loginUser)

module.exports = route