const express = require('express')
const router = express.Router()
const { create } = require('../controllers/contractPricing')

router.post('/create', async (req, res, next) => {
    try {
        const pricing = await create(req.body)

        return res.status(201).json(pricing)
    } catch (error) {
        next(error)
    }
})


module.exports = router
