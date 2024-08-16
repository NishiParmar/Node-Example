const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE contract SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /contract/create', () => {
        test('Valid creates new contract.', async () => {
            const contractObject = {
                resource_id: 1,
                supplier: 'Origin'
            }
            const res = await request(app)
                .post('/api/contract/create')
                .send(contractObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('get /contract/list', () => {
        test('Valid returns contract list.', async () => {
            const res = await request(app)
                .get('/api/contract/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('put /contract/:id', () => {
        test('Valid updates contract data.', async () => {
            const CONTRACT_ID = testObjectId
            const res = await request(app)
                .put(`/api/contract/${CONTRACT_ID}`)
                .send({ supplier: 'Test Supplier' })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /contract/:id', () => {
        test('Valid returns contract data.', async () => {
            const CONTRACT_ID = testObjectId
            const res = await request(app)
                .get(`/api/contract/${CONTRACT_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(CONTRACT_ID)
        })

        test('Invalid returns no contract data.', async () => {
            const CONTRACT_ID = 0
            const res = await request(app)
                .get(`/api/contract/${CONTRACT_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}