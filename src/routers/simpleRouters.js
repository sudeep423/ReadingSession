const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const ReadingLog = require('../models/readingLog')
const DigiBook = require('../models/book')

router.post('/user', async (req, res) => {
    try {
        const user = new User({ ...req.body })
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.post('/book', async (req, res) => {
    try {
        const book = new DigiBook({ ...req.body })
        await book.save()
        res.status(201).send(book)
    } catch (e) {
        res.status(404).send(e)
    }
})

router.post('/ReadingLog', async (req, res) => {
    try {
        let readingLog = req.body
        readingLog.timeStamp = new Date(readingLog.timeStamp)
        readingLog.timeStamp = readingLog.timeStamp.getTime()
        const event = new ReadingLog(readingLog)
        await event.save()
        res.status(201).send(event)
    } catch (error) {
        console.log(1)
        res.status(404).send(error)
    }
})



router.get('/book', async (req, res) => {
    try {
        const book = await DigiBook.find()
        res.send(book)
    } catch (e) {
        res.send(e)
    }
})
router.get('/user', async (req, res) => {
    try {
        const user = await User.find()
        res.send(user)
    } catch (e) {
        res.send(e)
    }
})

module.exports = router