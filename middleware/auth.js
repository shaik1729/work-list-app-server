const validateToken = require('../helpers/validateToken');
const GenerateToken = require('../helpers/GenerateToken');

const auth = (req, res, next) => {
    const auth_token = req.header('x-auth-token');

    if(!auth_token) {
        return res.status(401).json({message: 'authorization token does not exist please login and get the token'});
    }

    const response = validateToken(auth_token);

    if(!response.status) {
        return res.status(401).json({message: 'authorization token is invalid please login and get the token'});
    }else{
        req.new_auth_token = GenerateToken(response);
        next();
    }
}

module.exports = auth;