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
    describe('get /cashflow/list/:projectId', () => {
        test('Valid returns cashflow list for an project', async () => {
            const PROJECT_ID = 1
            const res = await request(app)
                .get(`/api/cashflow/list/${PROJECT_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            const responseBodyData = res.body
            expect(responseBodyData.length).toBeGreaterThanOrEqual(1)
        })

        test('Valid returns empty list if project doesnot exist', async () => {
            const PROJECT_ID = 111
            const res = await request(app)
                .get(`/api/cashflow/list/${PROJECT_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            const responseBodyData = res.body
            expect(responseBodyData.length).toBe(0)
        })
    })

    describe('post /cashflow/create', () => {
        test('Valid adds new cashflows', async () => {
            const cashflow = {
                expenses: [{
                    project_id: 1,
                    name: 'Test Case CAPEX',
                    year_offset: 1,
                    cashflow: 150,
                    type: 'CAPEX'
                }]
            }
            const res = await request(app)
                .post('/api/cashflow/create')
                .send(cashflow)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
        })

        test('Invalid throws an error', async () => {
            const cashflow = {
                expenses: [{
                    project_id: 1,
                    name: 'Test Case CAPEX',
                    year_offset: 1,
                    cashflow: 150,
                    type: 'CAPEX'
                }]
            }
            const res = await request(app)
                .post('/api/cashflow/create')
                .send(cashflow)
                .expect('Content-Type', /json/)
                .expect(422)

            expect(res.statusCode).toBe(422)
        })
    })

    describe('put /cashflow/', () => {
        test('Valid updates cashflow data.', async () => {
            const updateObject = {
                editExpenses: [{
                    project_id: 1,
                    name: 'CAPEX',
                    year_offset: 0,
                    cashflow: -20800,
                    type: 'CAPEX',
                    cashflowId: 1
                }],
                removeExpenses: [{
                    cashflowId: 2
                }],
                addExpenses: [{
                    project_id: 1,
                    name: 'Test Case CAPEX 2',
                    year_offset: 2,
                    cashflow: 100,
                    type: 'CAPEX'
                }]
            }
            const res = await request(app)
                .put('/api/cashflow/')
                .send(updateObject)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })

        test('Invalid throws an error if cashflow with same type and name exists for an project.', async () => {
            const updateObject = {
                editExpenses: [],
                removeExpenses: [],
                addExpenses: [{
                    project_id: 1,
                    name: 'Test Case CAPEX 2',
                    year_offset: 2,
                    cashflow: 100,
                    type: 'CAPEX'
                }]
            }
            const res = await request(app)
                .put('/api/cashflow/')
                .send(updateObject)
                .expect('Content-Type', /json/)
                .expect(422)

            expect(res.statusCode).toBe(422)
        })
    })
}