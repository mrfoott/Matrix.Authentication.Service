const mongoose = require('mongoose')

const activityLog = new mongoose.Schema({
    user_id: {
        required: true,
        unique: true,
        type: String,
        minlength: 36,
        maxlength: 36
    },
    activityLog: {
        ipInfo: [],
        login_time: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            required: true
        }
    }
}, { timestamps: true })

module.exports = mongoose.model('activityLog', activityLog)
