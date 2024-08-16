const csv = require('csvtojson')

const convertCsvToJson = async (file) => {
    const bufferString = file.data.toString('utf8')

    const result = await csv().fromString(bufferString)
        .then((jsonObj) => {
            return jsonObj
        })
        .catch((err) => console.log(err))

    return result
}
module.exports = { convertCsvToJson }