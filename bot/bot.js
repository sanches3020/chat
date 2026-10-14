import { tick, quote } from './quotes.js'
import { log } from './server.js'

const DAY = 86400

let words = []
let day = 0
let minute = -1
let flushing = false

async function post(path, body) {
    const response = await fetch('http://' + process.env.APP_HOST + path, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    })
    const text = await response.text()
    if (response.status !== 200) {
        throw new Error(path + ' http ' + response.status + ', ' + text)
    }
    return JSON.parse(text)
}

async function load() {
    const rows = await post('/api/words.php', { limit: 5000 })
    const list = []
    const seen = new Set()
    for (const row of rows) {
        if (seen.has(row.word)) continue
        seen.add(row.word)
        list.push(row.word)
        const item = quote('word_' + row.word)
        if (row.price > 0) {
            item.price = row.price
            item.open = row.price
            item.open24 = row.price * (1 - row.price24)
        }
    }
    words = list
    day = Math.floor(Date.now() / 1000 / DAY)
}

export async function daily(key) {
    return post('/api/event_chart.php', { key: key, period_name: 'D', limit: 50 })
}

async function push() {
    if (day !== Math.floor(Date.now() / 1000 / DAY)) {
        await load()
    }
    const events = {}
    for (const word of words) {
        events['word_' + word] = Math.round(quote('word_' + word).price * 100) / 100
    }
    await post('/api/event_insert_group.php', { events: events })
}

export async function start() {
    const started = Date.now()
    tick(words, Math.floor(started / 1000))
    const current = Math.floor(started / 60000)
    if (current !== minute && !flushing) {
        minute = current
        flushing = true
        push().finally(() => flushing = false)
    }
    if (Date.now() - started > 1000) {
        log('slow tick ' + (Date.now() - started) + 'ms')
    }
    setTimeout(start, 1000 - (Date.now() % 1000))
}

