const usersDatabase = {
    users: require('../model/users.json'),
    setUsers(users) {
        this.users = users
    },
    addNewUser(user) {
        this.users.push(user)
    }
}

const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const fsPromises = fs.promises

const handleNewUser = async (req, res) => {
    const {username, password} = req.body
    if (!(username || password)) {
        return res.status(400).json({
            "message": "Username and password are required."
        })
    }

    const hasDuplicate = usersDatabase.users.find(person => person.username === username)
    if (hasDuplicate) {
        return res.sendStatus(409)
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = {
            "username": username,
            "password": hashPassword
        }
        usersDatabase.addNewUser(newUser)
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDatabase.users)
        )
        res.status(201).json({
            'success': `New user ${username} created.`
        })
    } catch (err) {
        res.status(500).json({
            "message": err.message
        })
    }
}

module.exports = {
    handleNewUser
}
