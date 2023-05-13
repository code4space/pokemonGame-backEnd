const route = require('express').Router()
const Player = require('../controllers/user')
const {User} = require('../models')
const { verifyToken } = require('../helper/jwt')
const Pokemon = require('../controllers/pokemon')

route.post('/login', Player.login)
route.post('/register', Player.register)

async function validation (req, res, next) {
    try {
        let accessToken = req.headers.access_token
        if (!accessToken) return res.status(401).json({message: "Invalid Token"})
        
        let payload = verifyToken(accessToken)
        const user = await User.findOne({
            where: {
                id: +payload.id
            }
        })
        if (!user) return res.status(401).json({message: "Invalid Token"})

        req.user = {id: user.id}
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Internal Server Error'})
    }
}
route.use(validation)

route.get('/pokemon', Pokemon.getMyCollection)
route.delete('/pokemon/:userID', Pokemon.deleteOneFromCollection)
route.post('/pokemon', Pokemon.addOneToCollection)
route.get('/random/pokemon', Pokemon.getOneRandom)

module.exports = route