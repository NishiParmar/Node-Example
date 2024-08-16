const express = require('express')
const router = express.Router()
const { list, findOne, create } = require('../controllers/asset')

router.post('/create', async (req, res, next) => {
    try {
        const asset = await create(req.body)

        return res.status(201).json(asset)
    } catch (error) {
        next(error)
    }
})
router.get('/list', async (req, res, next) => {
    try {
        const assets = await list()

        return res.json(assets)
    } catch (error) {
        next(error)
    }
})
router.get('/:id', async (req, res, next) => {
    try {
        const asset = await findOne(req.params.id)

        return res.json(asset)
    } catch (error) {
        next(error)
    }
})

module.exports = router
