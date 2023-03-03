const jwt = require('jsonwebtoken');

const validateToken = (token) => {
    try{
        const decode = jwt.verify(token, 'somesecret');
        return {
            username: decode.username,
            user_id: decode.user_id,
            status: true
        };
    }catch(e) {
        console.log(e);
        return {
            status: false
        }
    }
}

module.exports = validateToken;