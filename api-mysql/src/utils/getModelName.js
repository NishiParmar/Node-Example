module.exports = function getModalName(str) {
    str = str.trim().replace(/^_+|_+$/g, '')

    const words = str.split(/[_\-\s]+/)

    return words.reduce((acc, word, i) => acc + (i ? word[0].toUpperCase() + word.slice(1) : word), '')
}
