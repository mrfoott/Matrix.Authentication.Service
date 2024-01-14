const mongoose = require('mongoose')

const verifyCodeSchema = mongoose.Schema({
    typeOfCode: {
        type: String,
        required: true,
        minlength:2,
        maxlength:30,
    },
    emailRequest: {
        type: String,
        required: true,
        minlength: 6
    },
    code: {
        type: String,
        required: true,
        minlength:6,
        maxlength:6
    },
    expired_time: {
        type: Number,
        required: true
    }
}, {timestamps:true})

module.exports = mongoose.model('verifycode', verifyCodeSchema)
