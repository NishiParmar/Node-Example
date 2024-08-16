const express = require('express')
const router = express.Router()
const { assign, updatePermissionGroup, businessList, siteList, createPermissionGroup } = require('../controllers/admin')

router.put('/user', async (req, res, next) => {
    try {
        const user = await assign(req.body)

        return res.json(user)
    } catch (error) {
        next(error)
    }
})

router.get('/business/list', async (req, res, next) => {
    try {
        const list = await businessList()

        return res.json(list)
    } catch (error) {
        next(error)
    }
})

router.post('/site/list', async (req, res, next) => {
    try {
        const list = await siteList(req.body.businesses)

        return res.json(list)
    } catch (error) {
        next(error)
    }
})

router.put('/permission-group', async (req, res, next) => {
    try {
        const user = await updatePermissionGroup(req.body)

        return res.json(user)
    } catch (error) {
        next(error)
    }
})

router.post('/permission-group', async (req, res, next) => {
    try {
        const permissionGroup = await createPermissionGroup(req.body)

        return res.status(201).json(permissionGroup)
    } catch (error) {
        next(error)
    }
})

module.exports = router
