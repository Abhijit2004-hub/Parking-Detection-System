const jwt = require('jsonwebtoken');

const userValidate = (req, res, next) => {
    const auth = req.headers['authorization'];
    if(!auth){
        return res.status(403).json({ message: "Unauthorized, JWT token is required" });
    }

    try{
        const token = auth.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "user"){
            return res.status(401).json({ message: "Unauthorized, not a user" });
        }
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({ message: "Unauthorized, JWT token wrong or expired" });
    }
};

module.exports = userValidate;