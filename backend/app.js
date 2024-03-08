import express from 'express'
import bodyParser from 'body-parser'
import { router } from './routes/feed.js'

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})

app.use('/feed', router)

app.listen(4000, () => {
    console.log('listening on port 4000');
})