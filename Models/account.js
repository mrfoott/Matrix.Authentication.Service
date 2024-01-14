const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    user_id: {
        required: true,
        unique: true,
        type: String,
        minlength: 36,
        maxlength: 36
    },
    password: {
        type: string,
        required: true,
        minlength: 6
    },
}, { timestamps: true })

module.exports = mongoose.model('account', accountSchema)