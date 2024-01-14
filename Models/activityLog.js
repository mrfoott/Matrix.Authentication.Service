const mongoose = require('mongoose')

const activityLog = new mongoose.Schema({
    user_id: {
        required: true,
        unique: true,
        type: String,
        minlength: 36,
        maxlength: 36
    },
    ipInfo: {
        ip: { type: String, required: true },
        city: { type: String, required: true },
        region: { type: String, required: true },
        country: { type: String, required: true },
        loc: { type: String, required: true },
        org: { type: String, required: true },
        postal: { type: String, required: true },
        timezone: { type: String, required: true },
    },
    userAgent: {
        type: String,
        required: true
    },
    login_time: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('activityLog', activityLog)
