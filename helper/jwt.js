const jwt = require('jsonwebtoken');
const KONCI = 'rahasia'

function getToken (payload) {
    return jwt.sign(payload, KONCI)
}

function verifyToken (token) {
    return jwt.verify(token, KONCI)
}

module.exports = {getToken, verifyToken}