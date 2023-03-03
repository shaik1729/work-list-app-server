const jwt = require('jsonwebtoken');

const GenerateToken = (payload) => {
    console.log(payload)
    return jwt.sign(payload, 'somesecret', {expiresIn: '1m'})
}

module.exports = GenerateToken;