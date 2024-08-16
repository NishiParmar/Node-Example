const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
const db = require('../../../src/models')

let testObjectId, testPricingObjectId, testUpdateObjectId, testUpdatePricingObjectId
beforeAll(async () => {
    const [updateContractPeriodId] = await db.sequelize.query('INSERT INTO contract_period (contract_id, start_date, end_date, projected) VALUES (1, "2026-04-01", "2026-05-01", "1")')
    const [updateContractPricingId] = await db.sequelize.query(`INSERT INTO contract_pricing (contract_period_id, price) VALUES (${updateContractPeriodId}, "125")`)
    testUpdateObjectId = updateContractPeriodId
    testUpdatePricingObjectId = updateContractPricingId
})
afterAll(async () => {
    console.log({ testUpdateObjectId, testUpdatePricingObjectId, testObjectId, testPricingObjectId })
    await db.sequelize.query(`UPDATE contract_period SET deleted_at='0000-00-00' WHERE id=${testObjectId}`)
    await db.sequelize.query(`UPDATE contract_pricing SET deleted_at='0000-00-00' WHERE id=${testPricingObjectId}`)
    await db.sequelize.query(`UPDATE contract_period SET deleted_at='0000-00-00' WHERE id=${testUpdateObjectId}`)
    await db.sequelize.query(`UPDATE contract_pricing SET deleted_at='0000-00-00' WHERE id=${testUpdatePricingObjectId}`)
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /contract-period/create', () => {
        test('Valid adds new contract period along with pricing', async () => {
            const period = {
                contract_id: 1,
                start_date: '2026-02-01',
                end_date: '2026-03-01',
                projected: 1,
                price: 150
            }
            const res = await request(app)
                .post('/api/contract-period/create')
                .send(period)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            const responseBodyData = res.body
            expect(Object.keys(responseBodyData).length).toEqual(2)
            testObjectId = res.body.period.id
            testPricingObjectId = res.body.pricing.id
        })

        test('Invalid throws an error if contract period already exist with dates we want to add', async () => {
            const period = {
                contract_id: 1,
                start_date: '2026-02-15',
                end_date: '2026-03-01',
                projected: 1,
                price: 150
            }
            const res = await request(app)
                .post('/api/contract-period/create')
                .send(period)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.statusCode).toBe(400)
        })

        test('Invalid throws an error if we are trying to enter date range that includes a date range period already exist with some other contract period', async () => {
            const period = {
                contract_id: 1,
                start_date: '2026-01-01',
                end_date: '2026-03-15',
                projected: 1,
                price: 150
            }
            const res = await request(app)
                .post('/api/contract-period/create')
                .send(period)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.statusCode).toBe(400)
        })
    })

    describe('put /contract-period/:id', () => {
        test('Valid updates contract period along with pricing', async () => {
            const period = {
                contract_id: 1,
                start_date: '2026-03-01',
                end_date: '2026-04-01',
                projected: 1,
                price: 150
            }
            const res = await request(app)
                .put(`/api/contract-period/${testUpdateObjectId}`)
                .send(period)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
            const responseBodyData = res.body
            expect(Object.keys(responseBodyData).length).toEqual(2)
        })

        test('Invalid throws an error if contract period already exist with dates we are updating', async () => {
            const period = {
                contract_id: 1,
                start_date: '2026-02-15',
                end_date: '2026-03-01',
                projected: 1,
                price: 15500
            }
            const res = await request(app)
                .put(`/api/contract-period/${testUpdateObjectId}`)
                .send(period)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.statusCode).toBe(400)
        })

        test('Invalid throws an error if we are trying to enter date range that includes a date range period already exist with some other contract period', async () => {
            const period = {
                contract_id: 1,
                start_date: '2026-01-01',
                end_date: '2026-03-15',
                projected: 1,
                price: 150
            }
            const res = await request(app)
                .put(`/api/contract-period/${testUpdateObjectId}`)
                .send(period)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(res.statusCode).toBe(400)
        })

    })
}