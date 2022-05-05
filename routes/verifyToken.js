const jwt = require('jsonwebtoken')
require('dotenv').config()


const verifyToken = (req, res, next)=>{
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SEC_KEY, (err, user)=>{
            if(err) res.status(403).json("Token is not valid");
            req.user = user;
            next()
        })

    }else{
        return res.status(401).json("You are not authenticated")
    }
}

const verifyTokenAndAuthorization =  (req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(404).json("You are not allowed ")
        }
    })
}


const verifyTokenAndAdmin =  (req, res, next)=>{
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(404).json("You are not allowed because you are not an Admin")
        }
    })
}

module.exports = { verifyTokenAndAuthorization, verifyTokenAndAdmin }