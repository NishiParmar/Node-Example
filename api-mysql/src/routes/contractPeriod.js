const express = require('express')
const router = express.Router()
const { create, update, remove } = require('../controllers/contractPeriod')

router.post('/create', async (req, res, next) => {
    try {
        const period = await create(req.body)

        return res.status(201).json(period)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const period = await update(query, req.body)

        return res.json(period)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const period = await remove(query)

        return res.json(period)
    } catch (error) {
        next(error)
    }
})

module.exports = router
