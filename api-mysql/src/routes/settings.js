const express = require('express')
const router = express.Router()
const { list, findOne, create, update } = require('../controllers/settings')

router.post('/create', async (req, res, next) => {
    try {
        const setting = await create(req.body)

        return res.status(201).json(setting)
    } catch (error) {
        next(error)
    }
})

router.post('/list', async (req, res, next) => {
    try {
        const settings = await list(req.body)

        return res.json(settings)
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        const setting = await findOne(req.body)

        return res.json(setting)
    } catch (error) {
        next(error)
    }
})

router.put('/:code', async (req, res, next) => {
    try {
        const query = {
            business_id: req.body.business_id,
            setting_name: req.params.code
        }
        const setting = await update(query, { value: req.body.value })

        return res.json(setting)
    } catch (error) {
        next(error)
    }
})

module.exports = router
