const express = require('express')
const router = express.Router()
const { list, findOne, create, update } = require('../controllers/resource')

router.post('/create', async (req, res, next) => {
    try {
        const resource = await create(req.user, req.body)

        return res.status(201).json(resource)
    } catch (error) {
        next(error)
    }
})

router.post('/list', async (req, res, next) => {
    try {
        const resources = await list(req.body)

        return res.json(resources)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const resource = await findOne(req.params.id)

        return res.json(resource)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const resource = await update(req.user, query, req.body)

        return res.json(resource)
    } catch (error) {
        next(error)
    }
})

module.exports = router
