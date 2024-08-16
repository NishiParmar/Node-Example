const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const apiAccessMiddleware = require('../middlewares/apiLogger.middleware')
const router = express.Router()
const verifyAdmin = require('../middlewares/verify.admin.middleware')

// public routes
router.use('/health', require('./health'))

// Authentication check
router.use(authMiddleware)

// Logs api call as request finishes
router.use(apiAccessMiddleware)

// Authenticated routes
router.use('/asset', require('./asset'))
router.use('/businesses', require('./businesses'))
router.use('/sites', require('./sites'))
router.use('/project', require('./projects'))
router.use('/unit', require('./unit'))
router.use('/setting', require('./settings'))
router.use('/opportunity', require('./opportunity'))
router.use('/flow', require('./flow'))
router.use('/resource', require('./resource'))
router.use('/log', require('./log'))
router.use('/user', require('./user'))
router.use('/task', require('./task'))
router.use('/location', require('./location'))
router.use('/contract', require('./contract'))
router.use('/impact', require('./impact'))
router.use('/contract-period', require('./contractPeriod'))
router.use('/contract-pricing', require('./contractPricing'))
router.use('/cashflow', require('./cashflow'))
router.use('/flow-impact', require('./flowImpact'))
router.use('/metric-value', require('./metricValue'))
router.use('/metric', require('./metric'))
router.use('/meter', require('./meter'))
router.use('/asset-meter', require('./assetMeter'))
router.use('/group', require('./group'))
router.use('/group-tag', require('./groupTag'))
router.use('/mac', require('./mac'))
router.use('/contact', require('./contact'))
router.use('/case-cashflow', require('./caseCashFlow'))
router.use('/case-impact', require('./caseImpact'))
router.use('/permission', require('./permission'))
router.use('/permission-group', verifyAdmin, require('./permissionGroup'))
router.use('/user-permission', require('./userPermission'))
router.use('/emission', require('./emission'))
router.use('/admin', verifyAdmin, require('./admin'))
router.use('/path', verifyAdmin, require('./path'))

router.use('/report', require('./reports'))

module.exports = router
