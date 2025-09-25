
class ProdService {
    constructor(model){
        this.model = model
    }
    async getProducts() {
        const products = await this.model.products.find()
        return products
    }
}

module.exports = { ProdService }