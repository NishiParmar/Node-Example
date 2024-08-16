const express = require('express')
const router = express.Router()
const { list, findOne, create } = require('../controllers/units')

router.post('/create', async (req, res, next) => {
    try {
        const unit = await create(req.body)

        return res.status(201).json(unit)
    } catch (error) {
        next(error)
    }
})
router.get('/list', async (req, res, next) => {
    try {
        const units = await list()

        return res.json(units)
    } catch (error) {
        next(error)
    }
})
router.get('/:id', async (req, res, next) => {
    try {
        const unit = await findOne(req.params.id)

        return res.json(unit)
    } catch (error) {
        next(error)
    }
})

module.exports = router
