import { prices } from '../quotes.js'

export default (req, res) => {
    res.json(prices(req.query.words || ''))
}
