const mongoose = require('mongoose')

const readingLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    event_type: {
        type: String,
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'digiBook',
        required: true
    },
    timeStamp: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

const ReadingLog = mongoose.model('ReadingLog', readingLogSchema)

module.exports = ReadingLog