var express = require('express');
var prodRouter = express.Router();
const { ProdController } = require('../controller/ProdController');
const prodController = new ProdController()

prodRouter.get('/:id', prodController.getProducts)

module.exports = prodRouter;
