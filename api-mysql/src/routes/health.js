const express = require('express')

const router = express.Router()
const healthController = require('../controllers/health')

// This serves as a simple function to check the service's health to ensure it is running
router.get('/', async (req, res, next) => {
    try {
        const data = await healthController.get()

        return res.json(data)
    } catch (error) {
        return res.status(500).json({ message: 'database connection is not established', data: error?.message })
        // next(error)
    }
})

module.exports = router
