const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    await db.sequelize.query(`UPDATE flow_impact SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /flow-impact/create', () => {
        test('Valid creates new flow-impact.', async () => {
            const flowImpactObject = {
                flow_id: 1,
                cost: 75,
                emissions_scope1: 100,
                emissions_scope2: 200,
                emissions_scope3: 300
            }
            const res = await request(app)
                .post('/api/flow-impact/create')
                .send(flowImpactObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('get /flow-impact/list', () => {
        test('Valid returns flow-impact list.', async () => {
            const res = await request(app)
                .get('/api/flow-impact/list')
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('put /flow-impact/:id', () => {
        test('Valid updates flow-impact data.', async () => {
            const FLOW_IMPACT_ID = testObjectId
            const res = await request(app)
                .put(`/api/flow-impact/${FLOW_IMPACT_ID}`)
                .send({ cost: 50 })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /flow-impact/:id', () => {
        test('Valid returns flow-impact data.', async () => {
            const FLOW_IMPACT_ID = testObjectId
            const res = await request(app)
                .get(`/api/flow-impact/${FLOW_IMPACT_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(FLOW_IMPACT_ID)
        })

        test('Invalid returns no flow-impact data.', async () => {
            const FLOW_IMPACT_ID = 0
            const res = await request(app)
                .get(`/api/flow-impact/${FLOW_IMPACT_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })
}