const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    const cashflow = await db.cashflow.bulkCreate(payload)

    return cashflow
}

async function list(project_id) {
    const cashflowList = await db.cashflow.findAll({
        where: { project_id }
    })

    return cashflowList
}

async function findOne(cashflowId) {
    const cashflow = await db.cashflow.findByPk(cashflowId)

    if (!cashflow) {
        throw new createHttpError[404]('Cashflow not found.')
    }

    return cashflow
}

async function update(payload) {
    let { editExpenses, removeExpenses, addExpenses } = payload

    const existingAdditions = []
    const newAddExpenses = []
    if (addExpenses?.length > 0) {
        for (let cashflowObj of addExpenses) {
            let { cashflow, ...rest } = cashflowObj
            const existingCashflow = await db.cashflow.findOne({ where: rest, raw: true })
            if (existingCashflow) {
                existingAdditions.push({ id: existingCashflow.id, cashflow, ...rest })
                // console.log({ existingCashflow })
            } else {
                newAddExpenses.push(cashflowObj)
            }
        }
    }

    const expenseIdArray = []
    if (removeExpenses?.length > 0) {
        for (let cashflowObj of removeExpenses) {
            const { cashflowId } = cashflowObj
            expenseIdArray.push(parseInt(cashflowId))
        }
    }

    editExpenses = editExpenses?.length > 0 ? editExpenses : []
    if (existingAdditions.length > 0) {
        for (let cashflow of existingAdditions) {
            if (expenseIdArray.length > 0 && expenseIdArray.includes(cashflow.id)) {
                const { id, ...rest } = cashflow
                const index = expenseIdArray.indexOf(parseInt(id))
                expenseIdArray.splice(index, 1)
                editExpenses.push({ cashflowId: id, ...rest })
            } else {
                // eslint-disable-next-line no-unused-vars
                let { id, ...rest } = cashflow
                newAddExpenses.push(rest)
            }
        }
    }

    const newExpenses = newAddExpenses?.length > 0 && await db.cashflow.bulkCreate(newAddExpenses)

    if (editExpenses?.length > 0) {
        for (let cashflowObj of editExpenses) {
            const { cashflowId: id } = cashflowObj
            const query = { id }
            await db.cashflow.update(cashflowObj, { where: query })
        }
    }

    if (expenseIdArray?.length > 0) {
        await db.cashflow.destroy({ where: { id: { [db.Sequelize.Op.in]: expenseIdArray } }, force: true })
    }

    return { addExpenses: newExpenses, editExpenses }
}

module.exports = { create, list, findOne, update }