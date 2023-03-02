const validateToken = require('../helpers/validateToken');

const auth = (req, res, next) => {
    const auth_token = req.header('x-auth-token');

    if(!auth_token) {
        return res.status(401).json({message: 'authorization token does not exist please login and get the token'});
    }

    if(!validateToken(auth_token)) {
        return res.status(401).json({message: 'authorization token is invalid please login and get the token'});
    }else{
        next();
    }

    // try{
    //     const decoded = jwt.verify(token, 'somesecret');
    //     req.user = decoded;
    //     req.token = token;
    //     next();
    // }catch(e) {
    //     console.log(e);
    //     return res.status(401).json({message: 'authorization token is invalid please login and get the token'});
    // }

}

module.exports = auth;