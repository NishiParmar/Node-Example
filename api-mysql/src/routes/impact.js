const express = require('express')
const router = express.Router()
const { list, findOne, create, update } = require('../controllers/impact')

router.post('/create', async (req, res, next) => {
    try {
        const impact = await create(req.body)

        return res.status(201).json(impact)
    } catch (error) {
        next(error)
    }
})
router.get('/list', async (req, res, next) => {
    try {
        const impacts = await list()

        return res.json(impacts)
    } catch (error) {
        next(error)
    }
})
router.get('/:id', async (req, res, next) => {
    try {
        const impact = await findOne(req.params.id)

        return res.json(impact)
    } catch (error) {
        next(error)
    }
})
router.put('/', async (req, res, next) => {
    try {
        const impacts = await update(req.body)

        return res.json(impacts)
    } catch (error) {
        next(error)
    }
})

module.exports = router
