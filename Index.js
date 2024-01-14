const express = require("express")
const authRoute = require("./Routes/AuthRoute")
const mongoose = require('mongoose')
const cors = require("cors")
const cookieParser = require("cookie-parser")

require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

//ROUTE GET

//ROUTE POST
app.use("/v1/auth", authRoute)

// conn db
const dbConnect = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("connect success!!");
    } catch (error) {
        throw error
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    dbConnect()
    console.log(`Server is running on PORT: ${PORT}`);
})