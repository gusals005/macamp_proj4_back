const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    // read the token from header or url 
    const token = req.headers['x-access-token'] || req.query.token

    if(!token) {
        return res.status(200).json({message:"error"});
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    const onError = (error) => {
        res.status(200).json({message:"error"});
    }

    // process the promise
    p.then((decoded)=>{
        req.decoded = decoded
        next()
    }).catch(onError)
}

module.exports = authMiddleware