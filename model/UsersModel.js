const { model, Schema } = require("mongoose");
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    firstname: {
        type: String,
        match: [/^[A-Z][a-z]+$/, 'Firstname must start with uppercase and continue with lowercases'],
        required: [true, 'Firstname is required field']
    },
    lastname: {
        type: String,
        match: [/^[A-Z][a-z]+$/, 'Lastname must start with uppercase and continue with lowercases'],
        required: [true, 'Lastname is required field']
    },
    age: {
        type: String,
        min: [16, 'you must be over 16 years old'],
        required: [true, 'Age is required field']
    },
    email: {
        type: String,
        unique: true,
        match: [/^[\w.-]+@[a-zA-Z\d-]+(\.[a-zA-Z\d-]+)*\.[a-zA-Z]{2,}$/, 'Please provide a valid email address'],
        required: [true, 'Email is required field']
    },
    password: {
        type: String,
        match: [/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/, 'Not valid password'],
        required: [true, 'Password is required field']
    },
    cart: {
        type: Array,
        default: []
    },
    avatarUrl: {
        type: String,
        required: true
    }
})

userSchema.pre('save', async function (next) {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next()
})

module.exports = model('users', userSchema)