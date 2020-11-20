const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    bookName: {
        type: String,
        unique: true,
        required: true,
    }
})

const digiBook = mongoose.model('digiBook', bookSchema)

module.exports = digiBook