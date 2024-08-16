const { express, internalServerError500 } = require('../utils')
const router = express.Router()
const { getReports, metabaseUrl } = require('../controllers/reports')

router.get('/', async (req, res) => {
    try {
        let reports = await getReports()

        res.status(200).json({ data: reports })
    } catch (err) {
        internalServerError500(err)
    }
})

router.post('/url', async (req, res) => {
    try {
        const url = await metabaseUrl(req)

        res.status(200).json({ data: url })
    } catch (err) {
        internalServerError500(err)
    }
})

module.exports = router
