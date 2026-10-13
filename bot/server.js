import express from 'express'

export function log(data) {
    console.log('LOG:', data)
}

process.on("unhandledRejection", (error) => log(error))

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    if (req.method === 'OPTIONS') return res.sendStatus(204)
    next()
})

app.use(express.json())

import chart from './api/chart.js'
import prices from './api/prices.js'

const apiRouter = express.Router()
apiRouter.use('/chart', chart)
apiRouter.use('/prices', prices)
app.use(apiRouter)

app.listen(process.env.BOT_PORT)
    .on('listening', () => log('SERVER START ON PORT ' + process.env.BOT_PORT))
    .on('error', error => log('SERVER ERROR ' + error.message))

import { start } from './bot.js'
start()
