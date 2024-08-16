const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE asset_meter SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /asset-meter/create', () => {
        test('Valid creates new asset-meter.', async () => {
            const assetMeterObject = {
                asset_id: 1,
                meter_id: 1
            }
            const res = await request(app)
                .post('/api/asset-meter/create')
                .send(assetMeterObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('put /asset-meter/:id', () => {
        test('Valid updates asset-meter data.', async () => {
            const ASSET_METER_ID = testObjectId
            const res = await request(app)
                .put(`/api/asset-meter/${ASSET_METER_ID}`)
                .send({ asset_id: 2 })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /asset-meter/:id', () => {
        test('Valid returns asset-meter data.', async () => {
            const ASSET_METER_ID = testObjectId
            const res = await request(app)
                .get(`/api/asset-meter/${ASSET_METER_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(ASSET_METER_ID)
        })

        test('Invalid returns no asset-meter data.', async () => {
            const ASSET_METER_ID = 0
            const res = await request(app)
                .get(`/api/asset-meter/${ASSET_METER_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })

    describe('get /asset-meter/list', () => {
        test('Valid returns asset-meter list.', async () => {
            const res = await request(app)
                .get('/api/asset-meter/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })
}