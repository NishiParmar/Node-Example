const db = require('../models')

async function create(payload) {
    const caseCashFlow = await db.caseCashflow.bulkCreate(payload)

    return caseCashFlow
}

async function update(payload) {
    let { editExpenses, removeExpenses, addExpenses } = payload

    const existingAdditions = []
    const newAddExpenses = []
    if (addExpenses?.length > 0) {
        for (let cashflowObj of addExpenses) {
            let { cashflow, ...rest } = cashflowObj
            const existingCashflow = await db.caseCashflow.findOne({ where: rest, raw: true })
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
            const { caseCashflowId } = cashflowObj
            expenseIdArray.push(parseInt(caseCashflowId))
        }
    }

    editExpenses = editExpenses?.length > 0 ? editExpenses : []
    if (existingAdditions.length > 0) {
        for (let caseCashflow of existingAdditions) {
            if (expenseIdArray.length > 0 && expenseIdArray.includes(caseCashflow.id)) {
                const { id, ...rest } = caseCashflow
                const index = expenseIdArray.indexOf(parseInt(id))
                expenseIdArray.splice(index, 1)
                editExpenses.push({ caseCashflowId: id, ...rest })
            } else {
                // eslint-disable-next-line no-unused-vars
                let { id, ...rest } = caseCashflow
                newAddExpenses.push(rest)
            }
        }
    }

    const newExpenses = newAddExpenses?.length > 0 && await db.caseCashflow.bulkCreate(newAddExpenses)

    if (editExpenses?.length > 0) {
        for (let cashflowObj of editExpenses) {
            const { caseCashflowId: id } = cashflowObj
            const query = { id }
            await db.caseCashflow.update(cashflowObj, { where: query })
        }
    }

    if (expenseIdArray?.length > 0) {
        await db.caseCashflow.destroy({ where: { id: { [db.Sequelize.Op.in]: expenseIdArray } }, force: true })
    }

    return { addExpenses: newExpenses, editExpenses }
}

async function list(opportunityId) {
    const [caseCashflows] = await db.sequelize.query(`
        SELECT cashCashFlow.id, cashCashFlow.business_case_id, cashCashFlow.name, cashCashFlow.year_offset, cashCashFlow.cashflow, cashCashFlow.type
        FROM case_cashflow AS cashCashFlow 
            LEFT JOIN business_case AS businessCase 
                ON cashCashFlow.business_case_id = businessCase.id
        WHERE businessCase.opportunity_id = ${opportunityId} AND cashCashFlow.deleted_at IS NULL
    `)

    return caseCashflows
}

module.exports = { create, update, list }