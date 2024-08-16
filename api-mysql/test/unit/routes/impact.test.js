const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

afterAll(() => {
    db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /impact/create', () => {
        test('Valid adds new impacts', async () => {
            const impacts = {
                reductions: [{
                    project_id: 1,
                    contract_id: 1,
                    year_offset: 0,
                    change: 12,
                    cost: 35
                }]
            }
            const res = await request(app)
                .post('/api/impact/create')
                .send(impacts)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            const responseBodyData = res.body
            expect(responseBodyData.length).toBeGreaterThanOrEqual(1)
        })
    })

    describe('put /impact/', () => {
        test('Valid updates impact data.', async () => {
            const updateObject = {
                editReductions: [{
                    project_id: 1,
                    year_offset: 1,
                    change: 60730000,
                    cost: 11418,
                    reductionId: 1
                }],
                removeReductions: [{
                    reductionId: 2
                }],
                addReductions: [{
                    project_id: 1,
                    year_offset: 2,
                    contract_id: 1,
                    change: 60730000,
                    cost: 11417
                }]
            }
            const res = await request(app)
                .put('/api/impact/')
                .send(updateObject)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('get /impact/:id', () => {
        test('Valid returns impact data', async () => {
            const IMPACT_ID = 1
            const res = await request(app)
                .get(`/api/impact/${IMPACT_ID}`)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })

        test('Invalid returns error', async () => {
            const IMPACT_ID = 0
            const res = await request(app)
                .get(`/api/impact/${IMPACT_ID}`)
                .expect('Content-Type', /json/)
                .expect(404)

            expect(res.statusCode).toBe(404)
            expect(res.body.message).toBe('Impact not found.')
        })
    })

    describe('get /impact/list', () => {
        test('Valid returns impact list', async () => {
            const res = await request(app)
                .get('/api/impact/list')
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })
    })
}