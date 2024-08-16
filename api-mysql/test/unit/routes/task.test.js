const { app, server } = require('../../../app')
const request = require('supertest')
const authMiddleware = require('../../../src/middlewares/auth.middleware')
// const db = require('../../../src/models')

let testObjectId
afterAll(async () => {
    // await db.sequelize.close()
    server.close()
})
jest.mock('../../../src/middlewares/auth.middleware')
authMiddleware.mockImplementation((req, res, next) => {
    next()
})

module.exports = () => {
    describe('post /task/create', () => {
        test('Valid creates new task and role.', async () => {
            const taskObject = {
                start_date: '2022-07-01',
                end_date: '2022-08-01',
                name: 'Test Task',
                status: 'in-progress',
                business_id: 1,
                project_id: null,
                contactId: null
            }
            const res = await request(app)
                .post('/api/task/create')
                .send(taskObject)
                .expect('Content-Type', /json/)
                .expect(201)

            expect(res.statusCode).toBe(201)
            testObjectId = res.body.id
        })
    })

    describe('put /task/:id', () => {
        test('Valid updates task data.', async () => {
            const TASK_ID = testObjectId
            const res = await request(app)
                .put(`/api/task/${TASK_ID}`)
                .send({ name: 'Test Task 2' })
                .expect('Content-Type', /json/)
                .expect(200)

            const [responseBodyData] = res.body
            expect(responseBodyData).toBeGreaterThanOrEqual(0)
        })
    })

    describe('post /task/list', () => {
        test('Valid returns task list for particular project.', async () => {
            const res = await request(app)
                .post('/api/task/list')
                .send({ project_id: 1 })
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
        })
    })

    describe('get /task/:id', () => {
        test('Valid returns task data.', async () => {
            const TASK_ID = testObjectId
            const res = await request(app)
                .get(`/api/task/${TASK_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(200)
            expect(res.body.id).toEqual(TASK_ID)
        })

        test('Invalid returns no task data.', async () => {
            const TASK_ID = 0
            const res = await request(app)
                .get(`/api/task/${TASK_ID}`)
                .expect('Content-Type', /json/)

            expect(res.statusCode).toBe(404)
        })
    })

    describe('delete /task/:id', () => {
        test('Valid removes task data.', async () => {
            const TASK_ID = testObjectId
            const res = await request(app)
                .delete(`/api/task/${TASK_ID}`)
                .expect('Content-Type', /json/)
                .expect(200)

            expect(res.statusCode).toBe(200)
        })
    })
}