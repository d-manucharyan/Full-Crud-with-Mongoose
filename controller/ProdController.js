class ProdController {
    async getProducts(req, res) {
        const products = await req.app.locals.services.products.getProducts()
        res.render('home', {products})
    }
}


module.exports = { ProdController }