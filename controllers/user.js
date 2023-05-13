const { matchPassword } = require('../helper/bycrypt')
const { getToken } = require('../helper/jwt')
const {User} = require('../models')

class Player {
    static async login (req, res, next) {
        try {
            const {username, password} = req.body
            if (!username) return res.status(400).json({message: "Username is required"})
            if (!password) return res.status(400).json({message: "Password is required"})

            let user = await User.findOne({
                where: {
                    username
                }
            })
            if (!user) return res.status(401).json({message: "Invalid Username/Password"})

            const isTrue = matchPassword(password, user.password)
            if (!isTrue) return res.status(401).json({message: "Invalid Username/Password"})

            const payload = {id : user.id}
            const access_token = getToken(payload)
            res.status(200).json({access_token})
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    static async register (req, res, next) {
        try {
            const {username, password} = req.body
            if (!username) return res.status(400).json({message: 'Username is required'})
            if (!password) return res.status(400).json({message: 'Password is required'})

            let user = await User.create({username, password})
            res.status(201).json({id: user.id, user: user.username})
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = Player