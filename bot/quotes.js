const PERIODS = { M: 60, H: 3600 }
const KEEP = { M: 60, H: 50 }
const RANGE = 50
const PULL = 0.01
const quotes = new Map()

export function quote(key) {
    let item = quotes.get(key)
    if (item === undefined) {
        item = {
            price: 1,
            open: 1,
            open24: 1,
            candles: { M: new Map(), H: new Map() },
        }
        quotes.set(key, item)
    }
    return item
}

function candle(item, name, t, price) {
    const time = Math.floor(t / PERIODS[name]) * PERIODS[name]
    const candles = item.candles[name]
    let current = candles.get(time)
    if (current === undefined) {
        current = { period: name, time: time, open: price, high: price, low: price, close: price }
        candles.set(time, current)
    } else {
        current.high = Math.max(current.high, price)
        current.low = Math.min(current.low, price)
        current.close = price
    }
    while (candles.size > KEEP[name]) {
        candles.delete(candles.keys().next().value)
    }
}

export function tick(words, t) {
    for (const word of words) {
        const item = quote('word_' + word)
        const step = (Math.floor(Math.random() * (RANGE * 2 + 1)) - RANGE) / 1000
        let price = item.price * (1 + step) + (item.open - item.price) * PULL
        if (!(price > 0.01)) {
            price = 0.01
        }
        item.price = price
        candle(item, 'M', t, price)
        candle(item, 'H', t, price)
    }
}

export function candles(key, period) {
    const item = quotes.get(key)
    if (!item) {
        return []
    }
    return Array.from(item.candles[period === 'H' ? 'H' : 'M'].values()).slice(-50)
}

export function prices(words) {
    return words.split(',').filter(word => word !== '').map((word) => {
        const item = quote('word_' + word)
        return {
            word: word,
            price: Math.round(item.price * 100) / 100,
            price24: Math.round((item.price - item.open24) / item.price * 10000) / 10000,
        }
    })
}
