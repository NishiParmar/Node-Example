const express = require('express')
const router = express.Router()
const { create, list, findOne, update } = require('../controllers/metricValue')

router.post('/create', async (req, res, next) => {
    try {
        const metricValue = await create(req.body)

        return res.status(201).json(metricValue)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const metricValueList = await list()

        return res.json(metricValueList)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const metricValue = await findOne(req.params.id)

        return res.json(metricValue)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const metricValue = await update(query, req.body)

        return res.json(metricValue)
    } catch (error) {
        next(error)
    }
})

module.exports = router
