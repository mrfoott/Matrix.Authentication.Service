const mongoose = require('mongoose')
const dbConnect = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("connect success!!");
    } catch (error) {
        throw error
    }
}

module.exports = dbConnect