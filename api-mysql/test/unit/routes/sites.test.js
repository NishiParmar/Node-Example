const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
beforeAll(async () => {
    const [siteId] = await db.sequelize.query('INSERT INTO site (name) VALUES ("Test Site")')
    testObjectId = siteId
})
afterAll(async () => {
    await db.sequelize.query(`UPDATE site SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /sites/list', () => {
        test('Valid returns sites list.', async () => {
            const res = await request(app)
                .post('/api/sites/list')
                .send({ business_id: 1 })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('put /sites/:id', () => {
        test('Valid updates site data.', async () => {
            const SITE_ID = testObjectId
            const res = await request(app)
                .put(`/api/sites/${SITE_ID}`)
                .send({ name: 'Test Site 2' })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })
}