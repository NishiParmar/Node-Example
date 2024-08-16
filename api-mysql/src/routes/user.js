const express = require('express')
const router = express.Router()
const { create, list, addUserToGroup, getCurrentUser, createUser } = require('../controllers/user')
const verifyAdmin = require('../middlewares/verify.admin.middleware')

router.post('/create', async (req, res, next) => {
    try {
        const user = await createUser(req.user.email)

        return res.status(201).json(user)
    } catch (error) {
        next(error)
    }
})

router.get('/list', verifyAdmin, async (req, res, next) => {
    try {
        const userList = await list()

        return res.json(userList)
    } catch (error) {
        next(error)
    }
})

router.post('/log', async (req, res, next) => {
    try {
        const log = await create(req.body)

        return res.status(201).json(log)
    } catch (error) {
        next(error)
    }
})

router.post('/manage-group', async (req, res, next) => {
    try {
        const data = await addUserToGroup(req.body)

        return res.json(data)
    } catch (error) {
        next(error)
    }
})

router.get('/me', async (req, res, next) => {
    try {
        const accessToken = req.headers.accesstoken
        const data = await getCurrentUser(accessToken)

        return res.json(data)
    } catch (error) {
        next(error)
    }
})

module.exports = router
