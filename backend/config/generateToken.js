const jwt = require('jsonwebtoken');
const JWT_SEC = "sdsadsdsads";

const generateToken=(id)=>{
    return(
        jwt.sign({id},JWT_SEC)
    ) 
}

module.exports = generateToken;