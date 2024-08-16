const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectIdArray = []
afterAll(async () => {
    await db.sequelize.query(`UPDATE case_impact SET deleted_at='0000-00-00' WHERE id IN (${testObjectIdArray.join(',')})`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /case-impact/create', () => {
        test('Valid adds new case-impacts', async () => {
            const caseImpacts = {
                reductions: [{
                    business_case_id: null,
                    resource_id: null,
                    year_offset: 0,
                    change: 12,
                    cost: 35
                }, {
                    business_case_id: null,
                    resource_id: null,
                    year_offset: 0,
                    change: 24,
                    cost: 70
                }]
            }
            const res = await request(app)
                .post('/api/case-impact/create')
                .send(caseImpacts)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            const responseBodyData = res.body
            expect(responseBodyData.length).toBeGreaterThanOrEqual(1)
            for (let impact of res.body) { testObjectIdArray.push(impact.id) }
        })
    })

    describe('put /case-impact/', () => {
        test('Valid updates case impact data.', async () => {
            const updateObject = {
                editReductions: [{
                    year_offset: 1,
                    change: -50627000,
                    cost: -9090,
                    reductionId: testObjectIdArray[0]
                }],
                removeReductions: [{
                    reductionId: testObjectIdArray[1]
                }],
                addReductions: [{
                    business_case_id: null,
                    resource_id: null,
                    year_offset: 0,
                    change: 36,
                    cost: 105
                }]
            }
            const res = await request(app)
                .put('/api/case-impact/')
                .send(updateObject)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
            for (let impact of res.body.newReductions) { testObjectIdArray.push(impact.id) }
        })
    })
}