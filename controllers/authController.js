const bcrypt = require('bcrypt')

const usersDatabase = {
    users: require('../model/users.json'),
    setUsers(users) {
        this.users = users
    },
    addNewUser(user) {
        this.users.push(user)
    }
}

const jwt = require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')

const handleLogin = async (req, res) => {
    const {username, password} = req.body
    if (!(username || password)) {
        return res.send(400).json({
            "message": "Username and password are required"
        })
    }

    const userIndex = usersDatabase.users.findIndex(person => person.username === username)
    const foundUser = userIndex !== -1 ? usersDatabase.users[userIndex] : {}
    if (userIndex !== -1) {
        return res.status(401).json({
            "message": "User not found"
        })
    }

    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
        const accessToken = jwt.sign({
                "username": foundUser.username
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '30s'
            }
        )

        const refreshToken = jwt.sign({
                "username": foundUser.username
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '1d'
            }
        )

        usersDatabase.users[userIndex] = {
            ...foundUser, refreshToken
        }

        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDatabase.users)
        )

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.json({
            "success": `User ${username} is logged in`,
            accessToken
        })
    } else {
        res.sendStatus(401)
    }
}

module.exports = {
    handleLogin
}