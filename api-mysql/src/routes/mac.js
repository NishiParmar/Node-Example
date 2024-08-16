const express = require('express')
const { getMacList } = require('../controllers/mac')
const router = express.Router()


router.post('/list', async (req, res, next) => {
    try {
        const macs = await getMacList(req.body)

        return res.json(macs)
    } catch (error) {
        next(error)
    }
})
module.exports = router
