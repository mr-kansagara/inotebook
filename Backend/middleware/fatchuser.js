const jwt = require("jsonwebtoken")
const jWT_SECRATE = "thisismynamerajkansagara";


const fatchuser = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ error: "Please authenticate using the valid token" });
    }

    try {
        const data = jwt.verify(token, jWT_SECRATE);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using the valid token" });
    }
    
}



module.exports = fatchuser;