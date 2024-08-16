const express = require('express')
const router = express.Router()
const { list } = require('../controllers/permissionGroup')

router.get('/list', async (req, res, next) => {
    try {
        const permissionGroupList = await list()

        return res.json(permissionGroupList)
    } catch (error) {
        next(error)
    }
})

module.exports = router
