const express = require("express")
const authRoute = require("./Routes/AuthRoute")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dbConnect = require("./ConnectionDB")

require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

//ROUTE GET

//ROUTE POST
app.use("/v1/auth", authRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    dbConnect()
    console.log(`Server is running on PORT: ${PORT}`);
})