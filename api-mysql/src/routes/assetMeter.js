const express = require('express')
const router = express.Router()
const { create, list, findOne, update } = require('../controllers/assetMeter')

router.post('/create', async (req, res, next) => {
    try {
        const assetMeter = await create(req.body)

        return res.status(201).json(assetMeter)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const assetMeterList = await list()

        return res.json(assetMeterList)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const assetMeter = await findOne(req.params.id)

        return res.json(assetMeter)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const assetMeter = await update(query, req.body)

        return res.json(assetMeter)
    } catch (error) {
        next(error)
    }
})

module.exports = router
