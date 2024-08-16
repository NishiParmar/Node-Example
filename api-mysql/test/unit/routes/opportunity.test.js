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
    describe('post /opportunity/list', () => {
        test('Valid returns opportunity list.', async () => {
            const BUSINESS_ID = 1
            const res = await request(app)
                .post('/api/opportunity/list')
                .send({ business_id: BUSINESS_ID })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            // expect(res.body.length).toBeGreaterThanOrEqual(1)
        })
    })

    describe('post /opportunity/cost', () => {
        test('Valid returns opportunity costs.', async () => {
            const OPPORTUNITY_ID = 4
            const res = await request(app)
                .post('/api/opportunity/cost')
                .send({ opportunityId: OPPORTUNITY_ID })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('post /mac/list', () => {
        test('Valid returns mac list for business.', async () => {
            const macObject = { business_id: 1, yearOffset: 1 }
            const res = await request(app)
                .post('/api/mac/list')
                .send(macObject)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('post /opportunity/reductions', () => {
        test('Valid returns reductions for particular opportunity.', async () => {
            const OPPORTUNITY_ID = 4
            const res = await request(app)
                .post('/api/opportunity/reductions')
                .send({ opportunityId: OPPORTUNITY_ID })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('get /opportunity/locations/:oppId', () => {
        test('Valid returns list of locations for an opportunity.', async () => {
            const OPPORTUNITY_ID = 4
            const res = await request(app)
                .get(`/api/opportunity/locations/${OPPORTUNITY_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('get /opportunity/reductions/:oppId', () => {
        test('Valid returns reductions for particular opportunity.', async () => {
            const OPPORTUNITY_ID = 4
            const SCOPES = [1, 2, 3]
            const res = await request(app)
                .get(`/api/opportunity/reductions/${OPPORTUNITY_ID}?scopes=${SCOPES}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('put /opportunity/:id', () => {
        test('Valid updates opportunity data.', async () => {
            const OPPORTUNITY_ID = 4
            const opportunityObject = { description: 'EV Ute' }
            const res = await request(app)
                .put(`/api/opportunity/${OPPORTUNITY_ID}`)
                .send(opportunityObject)
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })

        test('Valid updates opportunity data with businessCase.', async () => {
            const OPPORTUNITY_ID = 4
            const opportunityObject = {
                description: 'New infill developments - generic',
                start_date: '2024-02-01',
                completion_date: '2025-11-30'
            }
            const res = await request(app)
                .put(`/api/opportunity/${OPPORTUNITY_ID}`)
                .send(opportunityObject)
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })

        test('Valid updates opportunity data with businessCase and adjusts the Case cashflows and impacts according to economic life.', async () => {
            const OPPORTUNITY_ID = 4
            const opportunityObject = {
                description: 'EV Ute',
                start_date: '2024-02-01',
                completion_date: '2025-11-30',
                economic_life: 14
            }
            const res = await request(app)
                .put(`/api/opportunity/${OPPORTUNITY_ID}`)
                .send(opportunityObject)
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('get /opportunity/:id', () => {
        test('Valid returns opportunity data.', async () => {
            const OPPORTUNITY_ID = 5
            const res = await request(app)
                .get(`/api/opportunity/${OPPORTUNITY_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(OPPORTUNITY_ID)
        })

        test('Invalid returns no opportunity data.', async () => {
            const OPPORTUNITY_ID = 111
            const res = await request(app)
                .get(`/api/opportunity/${OPPORTUNITY_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })

    describe('post /opportunity/create', () => {
        test('Valid creates new opportunity and businesscase.', async () => {
            const opportunityObject = {
                name: 'Test Case Opportunity',
                business_id: 1,
                description: 'New Opportunity',
                start_date: '2024-05-01',
                completion_date: '2025-05-09',
                economic_life: 10,
                location_id: 1,
                site_id: 1
            }
            const res = await request(app)
                .post('/api/opportunity/create')
                .send(opportunityObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            const responseBodyData = res.body
            expect(Object.keys(responseBodyData).length).toEqual(3)
        })
    })

    describe('post /opportunity/convert/:oppId', () => {
        test('Valid converts an opportunity into project along with impact, cashflow and emissions-factor data.', async () => {
            const OPPORTUNITY_ID = 4
            const opportunityObject = {
                start_date: '2024-05-01'
            }
            const res = await request(app)
                .post(`/api/opportunity/convert/${OPPORTUNITY_ID}`)
                .send(opportunityObject)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
            const responseBodyData = res.body
            expect(Object.keys(responseBodyData).length).toEqual(4)
        })

        test('Invalid throws an error.', async () => {
            const OPPORTUNITY_ID = 4
            const opportunityObject = {
                start_date: '2024-05-01'
            }
            const res = await request(app)
                .post(`/api/opportunity/convert/${OPPORTUNITY_ID}`)
                .send(opportunityObject)
                .expect('Content-Type', /json/)
                .expect(404)

            expect(res.statusCode).toBe(404)
        })
    })
}