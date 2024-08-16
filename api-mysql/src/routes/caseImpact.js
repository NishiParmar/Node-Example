const express = require('express')
const router = express.Router()
const { create, update, getResourcePrice } = require('../controllers/caseImpact')

router.post('/create', async (req, res, next) => {
    try {
        const caseImpact = await create(req.body)

        return res.status(201).json(caseImpact)
    } catch (error) {
        next(error)
    }
})

router.put('/', async (req, res, next) => {
    try {
        const caseImpact = await update(req.body)

        return res.json(caseImpact)
    } catch (error) {
        next(error)
    }
})

router.post('/price', async (req, res, next) => {
    try {
        const resourcePrice = await getResourcePrice(req.body)

        return res.json(resourcePrice)
    } catch (error) {
        next(error)
    }
})

module.exports = router
