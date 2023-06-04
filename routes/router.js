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

route.get('/user', Player.getUserInfo)
route.get('/pokemon', Pokemon.getMyCollection)
route.get('/pokemon/enemies/:difficulty', Pokemon.getEnemies)
route.get('/one/pokemon', Pokemon.getOnePokemon)
route.delete('/pokemon/:pokemonId', Pokemon.deleteOneFromCollection)
route.post('/pokemon', Pokemon.addOneToCollection)
route.patch('/skip/pokemon', Pokemon.skip)
route.patch('/pokemon/levelup', Pokemon.pokemonLevelUp)
route.patch('/pokeball/decrease', Player.pokeballUsed)
route.patch('/pokeball/increase', Player.getPokeball)
route.patch('/draw/increase/:amount', Player.drawIncrease)

module.exports = route