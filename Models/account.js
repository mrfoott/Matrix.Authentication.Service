const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    user_id: {
        required: true,
        unique: true,
        type: String,
        minlength: 36,
        maxlength: 36
    },
    email: {
        type:String,
        required:true,
        minlength:6,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
}, { timestamps: true })

module.exports = mongoose.model('account', accountSchema)