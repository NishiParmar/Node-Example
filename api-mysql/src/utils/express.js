const express = require('express')
require('express-async-errors') // Allows us to throw errors in async functions

// Choke point for throw in errors for easy setting of breakpoints!
const throwError = (status, message) => {
    const err = new Error(message)
    err.statusCode = status
    let insideError = message

    try {
        insideError = JSON.stringify(message)
    } catch (error) {
        console.error(
          `-------- THROW ERROR: ------------\n${error} ${insideError}\n-----------------------`
        )
    }

    console.error(`-------- THROW ERROR: ------------\n${err} ${insideError}\n-----------------------`)

    throw err
}

const badRequest400 = (message) => throwError(400, message)
const internalServerError500 = (message) => throwError(500, message)

module.exports = {
    express,
    badRequest400,
    internalServerError500
}
