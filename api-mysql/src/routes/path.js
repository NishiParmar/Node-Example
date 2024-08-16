const express = require('express')
const router = express.Router()
const { list } = require('../controllers/path')

router.get('/list', async (req, res, next) => {
    try {
        const path = await list()

        return res.status(201).json(path)
    } catch (error) {
        next(error)
    }
})

module.exports = router
