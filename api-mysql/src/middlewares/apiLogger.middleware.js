const db = require('../models')

const apiAccessMiddleware = async (req, res, next) => {
    try {
        res.once('finish', () => {
            const payload = {
                user_id: req.user?.username,
                body: req.body,
                params: req.params,
                endpoint: req.originalUrl
            }
            db.accessLogs.create(payload)
        })
        next()
    } catch (error) {
        next()
    }
}
module.exports = apiAccessMiddleware