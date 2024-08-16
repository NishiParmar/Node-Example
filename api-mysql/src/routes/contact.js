const express = require('express')
const router = express.Router()
const { list, create } = require('../controllers/contact')

router.post('/create', async (req, res, next) => {
    try {
        const impact = await create(req.body)

        return res.status(201).json(impact)
    } catch (error) {
        next(error)
    }
})
router.get('/list', async (req, res, next) => {
    try {
        const impact = await list(req.body)

        return res.json(impact)
    } catch (error) {
        next(error)
    }
})


module.exports = router
