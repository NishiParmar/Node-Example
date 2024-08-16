const express = require('express')
const router = express.Router()
const { create, getPermissionData } = require('../controllers/userPermission')

router.post('/create', async (req, res, next) => {
    try {
        const permissionList = await create(req.body)

        return res.status(200).json(permissionList)
    } catch (error) {
        next(error)
    }
})

router.get('/list', async (req, res, next) => {
    try {
        const data = await getPermissionData(req.user)
        const permissionList = data?.permissionUser?.permissionGroup || {}

        const allowedPathsArray = permissionList.allowed_paths
        const allowedPaths = allowedPathsArray.map(allowedPath => allowedPath.path.path).join(',')

        return res.json({ ...permissionList, allowed_paths: allowedPaths })
    } catch (error) {
        next(error)
    }
})

module.exports = router
