const { model, Schema } = require("mongoose");

const prodSchema = new Schema({
    title: String,
    description: String,
    price: Number
})


module.exports = model('products', prodSchema)