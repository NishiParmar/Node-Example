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
    describe('get /case-cashflow/list/:oppId', () => {
        test('Valid returns cash cashflow list for an opportunity', async () => {
            const OPPORTUNITY_ID = 4
            const res = await request(app)
                .get(`/api/case-cashflow/list/${OPPORTUNITY_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('post /case-cashflow/create', () => {
        test('Valid adds new case-cashflows', async () => {
            const caseCashflows = {
                expenses: [{
                    business_case_id: 1,
                    name: 'OPEX',
                    year_offset: 1,
                    cashflow: 150,
                    type: 'OPEX'
                }]
            }
            const res = await request(app)
                .post('/api/case-cashflow/create')
                .send(caseCashflows)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
        })

        test('Invalid throws an error', async () => {
            const caseCashflows = {
                expenses: [{
                    business_case_id: 1,
                    name: 'OPEX',
                    year_offset: 1,
                    cashflow: 150,
                    type: 'OPEX'
                }]
            }
            const res = await request(app)
                .post('/api/case-cashflow/create')
                .send(caseCashflows)
                .expect('Content-Type', /json/)
                .expect(422)

            expect(res.statusCode).toBe(422)
        })
    })

    describe('put /case-cashflow/', () => {
        test('Valid updates case-cashflow data.', async () => {
            const updateObject = {
                editExpenses: [{
                    business_case_id: 1,
                    name: 'CAPEX',
                    year_offset: 0,
                    cashflow: -20900,
                    type: 'CAPEX',
                    caseCashflowId: 1
                }],
                removeExpenses: [{
                    caseCashflowId: 100
                }],
                addExpenses: [{
                    business_case_id: 1,
                    name: 'CAPEX',
                    year_offset: 1,
                    cashflow: 20800,
                    type: 'CAPEX'
                }, {
                    business_case_id: 1,
                    name: 'CAPEX',
                    year_offset: 2,
                    cashflow: 20800,
                    type: 'CAPEX'
                }]
            }
            const res = await request(app)
                .put('/api/case-cashflow/')
                .send(updateObject)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })

        test('Invalid throws an error if cashflow with same type and name exists for an opportunity.', async () => {
            const updateObject = {
                editExpenses: [],
                removeExpenses: [],
                addExpenses: [{
                    business_case_id: 1,
                    name: 'OPEX',
                    year_offset: 1,
                    cashflow: 150,
                    type: 'OPEX'
                }]
            }
            const res = await request(app)
                .put('/api/case-cashflow/')
                .send(updateObject)
                .expect('Content-Type', /json/)
                .expect(422)

            expect(res.statusCode).toBe(422)
        })
    })
}