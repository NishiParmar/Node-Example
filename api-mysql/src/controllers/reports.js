// const AWS = require('aws-sdk')
// const { getOne, getList, insert, query } = require('../utils/database')
const jwt = require('jsonwebtoken')

async function metabaseUrl(event) {
    let body = event?.body || null
    if (!body || (!body.question && !body.dashboard) || !body.business_id) {
        return {
            error: true,
            message: 'Please provide valid inputs'
        }
    }

    var resource = {}
    var mbPath
    if (body.question) {
        resource['question'] = parseInt(body.question)
        mbPath = 'question'
    }
    if (body.dashboard) {
        resource['dashboard'] = parseInt(body.dashboard)
        mbPath = 'dashboard'
    }

    const mbSiteUrl = process.env.METABASE_URL
    const mbSecretKey = process.env.METABASE_KEY
    const payload = {
        resource: resource,
        params: { business_id: body.business_id },
        exp: Math.round(Date.now() / 1000) + 60 * 60 * 8, // Expiration time in EPOCH - 8 hours
    }
    const token = jwt.sign(payload, mbSecretKey.toString('utf-8'), { algorithm: 'HS256', allowInsecureKeySizes: true, allowInvalidAsymmetricKeyTypes: true })
    const iframeUrl = `${mbSiteUrl}/embed/${mbPath}/${token}#bordered=false&titled=false`

    return iframeUrl
}

async function getReports(event) {
    // let user = {}
    // if (process.env.AWS_SAM_LOCAL || process.env.NODE_ENV == 'test' || process.env.ENV_NAME == 'staging') {
    //     user.id = 'e34146f7-a3d5-4314-bac2-0666f79435b1'
    //     user.email = 'josh+t2xe@jpmedia.com.au'
    //     user.name = 'Josh Millard'
    // } else {
    //     user = await _getCognitoUser(event)
    // }

    // let filter = {userId: user.id}
    // let reportList = await getList('dashboard', filter)
    let reportList = []

    // Sort by sequence
    reportList.sort((a, b) => a.sequence - b.sequence)

    let reports = []
    for (let i = 0; i < reportList.length; i++) {
        const record = {
            'id': reportList[i].metabaseId,
            'name': reportList[i].dashboardName
        }
        reports.push(record)
    }

    return reports
}

module.exports = { metabaseUrl, getReports }
