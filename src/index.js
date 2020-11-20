const express = require('express')
require('./db/mongoose')
const mainRouter = require('./routers/router')
const simpleRouter = require('./routers/simpleRouters')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(mainRouter)
app.use(simpleRouter)

app.listen(port, () => {
    console.log('server is up on port ' + port)
})