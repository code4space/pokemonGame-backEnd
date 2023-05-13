const bcrypt = require('bcryptjs')

function hashPassword (password) {
    return bcrypt.hashSync(password, 10) 
}

function matchPassword (inputPasswword, hashPassword) {
    return bcrypt.compareSync(inputPasswword, hashPassword)
}

module.exports = {hashPassword, matchPassword}