const express = require('express')
const router = express.Router()
const { create, update, list } = require('../controllers/caseCashflow')

router.post('/create', async (req, res, next) => {
    try {
        const caseCashFlow = await create(req.body.expenses)

        return res.status(201).json(caseCashFlow)
    } catch (error) {
        next(error)
    }
})

router.put('/', async (req, res, next) => {
    try {
        const caseCashFlow = await update(req.body)

        return res.json(caseCashFlow)
    } catch (error) {
        next(error)
    }
})

router.get('/list/:opportunityId', async (req, res, next) => {
    try {
        const caseCashFlow = await list(req.params.opportunityId)

        return res.json(caseCashFlow)
    } catch (error) {
        next(error)
    }
})

module.exports = router
