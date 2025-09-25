const bcrypt = require('bcryptjs')

class AuthService {
    constructor(model) {
        this.model = model
    }
    async getUsers() {
        const users = await this.model.users.find()
        return users
    }
    async getUser(id) {
        const user = await this.model.users.findById(id)
        return user
    }
    async postUser(body) {
        const doc = await this.model.users(body)
        await doc.save()
    }
    async postLogin(body) {
        const foundUser = await this.model.users.findOne({ email: body.email })
        if (!foundUser) {
            return { success: false, message: "Wrong email or password" }
        } else {
            const isMatch = await bcrypt.compare(body.password, foundUser.password)
            if (!isMatch) {
                return { success: false, message: "Wrong email or password" }
            }
        }
        return {
            id: foundUser._id,
            success: true,
            message: "Login successed, Welcome !"
        }
    }
    async deleteUser(id) {
        await this.model.users.findByIdAndDelete(id)
    }
    async editUser(id, body) {
        const updatedUser = await this.model.users.findByIdAndUpdate(id, body, { runValidators: true })
        return updatedUser
    }
}

module.exports = { AuthService }