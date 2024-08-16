const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE asset SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /asset/create', () => {
        test('Valid creates new asset.', async () => {
            const assetObject = {
                site_id: 1,
                name: 'Test Asset',
                location_gps: '-34.8526490352967,138.478700740755',
                type: 'stationary'
            }
            const res = await request(app)
                .post('/api/asset/create')
                .send(assetObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('get /asset/list', () => {
        test('Valid returns asset list.', async () => {
            const res = await request(app)
                .get('/api/asset/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('get /asset/:id', () => {
        test('Valid returns asset data.', async () => {
            const ASSET_ID = testObjectId
            const res = await request(app)
                .get(`/api/asset/${ASSET_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(ASSET_ID)
        })

        test('Invalid returns no asset data.', async () => {
            const ASSET_ID = 0
            const res = await request(app)
                .get(`/api/asset/${ASSET_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}