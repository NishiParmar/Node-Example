const express = require('express')
const router = express.Router()
const { create, list, findOne, update } = require('../controllers/meter')

router.post('/create', async (req, res, next) => {
    try {
        const meter = await create(req.body)

        return res.status(201).json(meter)
    } catch (error) {
        next(error)
    }
})

router.post('/list', async (req, res, next) => {
    try {
        const meterList = await list(req.body.resource_id)

        return res.json(meterList)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const meter = await findOne(req.params.id)

        return res.json(meter)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const meter = await update(query, req.body)

        return res.json(meter)
    } catch (error) {
        next(error)
    }
})

module.exports = router
