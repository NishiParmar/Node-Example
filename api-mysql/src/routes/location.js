const express = require('express')
const router = express.Router()
const { create, list, findOne, update } = require('../controllers/location')

router.post('/create', async (req, res, next) => {
    try {
        const location = await create(req.body)

        return res.status(201).json(location)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const location = await list()

        return res.json(location)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const location = await findOne(req.params.id)

        return res.json(location)
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const query = { id: req.params.id }
        const location = await update(query, req.body)

        return res.json(location)
    } catch (error) {
        next(error)
    }
})

module.exports = router 
