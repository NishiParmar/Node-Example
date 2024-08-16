const express = require('express')
const router = express.Router()
const { create, list, findOne, update } = require('../controllers/cashflow')

router.post('/create', async (req, res, next) => {
    try {
        const cashflow = await create(req.body.expenses)

        return res.status(201).json(cashflow)
    } catch (error) {
        next(error)
    }
})

router.get('/list/:project_id', async (req, res, next) => {
    try {
        const cashflowList = await list(req.params.project_id)

        return res.json(cashflowList)
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const cashflow = await findOne(req.params.id)

        return res.json(cashflow)
    } catch (error) {
        next(error)
    }
})

router.put('/', async (req, res, next) => {
    try {
        const cashflow = await update(req.body)

        return res.json(cashflow)
    } catch (error) {
        next(error)
    }
})

module.exports = router
