const jwt = require("jsonwebtoken")
const User = require("../models/User")

async function auth(req, res, next) {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decoded = jwt.verify(token, "nodecourse")
        const authUser = await User.findOne({ _id: decoded._id, "tokens.token": token })
        if(!authUser) {
            throw new Error()
        }
        req.user = authUser
        next()
    } catch (error) {
        res.status(401).send({ error: "Please authenticate."})
    }
}

module.exports = auth