const express = require('express')
const router = express.Router()
const { create, list, findOne, update } = require('../controllers/metric')

router.post('/create', async (req, res, next) => {
    try {
        const metric = await create(req.body)

        return res.status(201).json(metric)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const metricList = await list()

        return res.json(metricList)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const metric = await findOne(req.params.id)

        return res.json(metric)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const metric = await update(query, req.body)

        return res.json(metric)
    } catch (error) {
        next(error)
    }
})

module.exports = router
