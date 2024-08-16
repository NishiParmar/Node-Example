const express = require('express')
const router = express.Router()
const { list, update } = require('../controllers/sites')

router.post('/list', async (req, res, next) => {
    try {
        const sites = await list(req.body, req.user)

        return res.json(sites)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const site = await update(query, req.body)

        return res.json(site)
    } catch (error) {
        next(error)
    }
})

module.exports = router
