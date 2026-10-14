import { candles } from '../quotes.js'
import { daily } from '../bot.js'

export default async (req, res) => {
    try {
        const period = req.query.period
        const body = period === 'D' ? await daily(req.query.key) : candles(req.query.key, period)
        res.json(body)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
