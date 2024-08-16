const express = require('express')
const router = express.Router()
const { create, list, findOne, update } = require('../controllers/contract')

router.post('/create', async (req, res, next) => {
    try {
        const contract = await create(req.body)

        return res.status(201).json(contract)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const results = await list()

        return res.json(results)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const contract = await findOne(req.params.id)

        return res.json(contract)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const contract = await update(query, req.body)

        return res.json(contract)
    } catch (error) {
        next(error)
    }
})

module.exports = router
