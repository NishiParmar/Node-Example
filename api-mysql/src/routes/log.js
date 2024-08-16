const express = require('express')
const router = express.Router()
const { create } = require('../controllers/logs')

router.post('/create', async (req, res, next) => {
    try {
        const resource = await create(req.body)

        return res.status(201).json(resource)
    } catch (error) {
        next(error)
    }
})

module.exports = router
