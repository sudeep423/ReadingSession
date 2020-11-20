const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const ReadingLog = require('../models/readingLog')
const DigiBook = require('../models/book')


function msToHMS(ms) {
    var seconds = ms / 1000;
    var hours = parseInt(seconds / 3600);
    seconds = seconds % 3600;
    var minutes = parseInt(seconds / 60);
    seconds = seconds % 60;
    return (hours + ":" + minutes + ":" + seconds);
}

// Function 1


router.get('/userDuration/:id', async (req, res) => {
    try {
        const user = req.params.id
        const readingLog = await ReadingLog.find({ user })
        readingLog.sort((a, b) => {
            return a.timeStamp.getTime() > b.timeStamp.getTime() ? 1 : -1;
        })
        let totalTime = 0;
        for (let i = 0; i < readingLog.length; i = i + 2) {
            if (i + 1 != readingLog.length) {
                totalTime += readingLog[i + 1].timeStamp.getTime() - readingLog[i].timeStamp.getTime() + 60000;
            } else {
                totalTime += Date.now().getTime() - readingLog[i].timeStamp.getTime() + 60000;
            }
        }
        res.send({ totalTIme: msToHMS(totalTime) })
    } catch (e) {
        res.status(400).send(e)
    }
})

//Function 2 
// /book/maths
// get all the users read this book

router.get('/book/:name', async (req, res) => {
    try {
        const book = await DigiBook.findOne({ bookName: req.params.name })
        const logs = await ReadingLog.find({ book: book.id, event_type: "start" }).populate('user')
        let users = logs.map(log => log.user)
        let us = Array.from(new Set(users))
        res.send(us)
    } catch (e) {
        res.send(e)
    }
})

// Function 3
// localhost:3000/dayduration/mm-dd-yy
// get all users read on this day and total time consumed by users
// output format time is in HH:MM:SS
router.get('/dayduration/:date', async (req, res) => {
    try {
        const startTime = (new Date(req.params.date)).getTime()
        const endTime = startTime + 86400000;
        const logs = await ReadingLog.find().populate('user')
        logs.sort((a, b) => {
            return a.timeStamp.getTime() > b.timeStamp.getTime() ? 1 : -1;
        })
        let timeByUser = {}
        let users = []
        for (let i = 0; i < logs.length; i++) {
            if (logs[i].timeStamp.getTime() >= endTime) {
                break;
            }
            if (logs[i].timeStamp.getTime() >= startTime) {
                if (timeByUser[logs[i].user.id] == undefined) {
                    timeByUser[logs[i].user.id] = []
                    users.push(logs[i].user)
                }
                timeByUser[logs[i].user.id].push(logs[i])
            }
        }
        let totalTime = 0;
        for (let i in timeByUser) {
            let j = 0;
            if (timeByUser[i][j].event_type === "end") {
                totalTime += timeByUser[i][j].timeStamp.getTime() - startTime + 60000;
                j += 1;
            }
            for (; j < timeByUser[i].length; j += 2) {
                if (j + 1 !== timeByUser[i].length) {
                    totalTime += timeByUser[i][j + 1].timeStamp.getTime() - timeByUser[i][j].timeStamp.getTime() + 60000;
                } else {
                    totalTime += endTime - timeByUser[i][j].timeStamp.getTime();
                }
            }
        }
        res.status(200).send({ users, totalTime: msToHMS(totalTime) })
    } catch (e) {
        res.status(500).send({ error: "server Error" })
    }
})


module.exports = router