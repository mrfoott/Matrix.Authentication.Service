const express = require("express")
const env = require("dotenv")
const authRoute = require("./Routes/authRoute")

// require.env.config()

const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
app.use(cors())
app.use(express.json())
app.use(cookieParser())

//ROUTE GET

//ROUTE POST
app.use("/v1/auth", authRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})