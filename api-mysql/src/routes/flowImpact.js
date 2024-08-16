const express = require('express')
const router = express.Router()
const { create, list, findOne, update } = require('../controllers/flowImpact')

router.post('/create', async (req, res, next) => {
    try {
        const flowImpact = await create(req.body)

        return res.status(201).json(flowImpact)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const flowImpactList = await list()

        return res.json(flowImpactList)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const flowImpact = await findOne(req.params.id)

        return res.json(flowImpact)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const flowImpact = await update(query, req.body)

        return res.json(flowImpact)
    } catch (error) {
        next(error)
    }
})

module.exports = router
