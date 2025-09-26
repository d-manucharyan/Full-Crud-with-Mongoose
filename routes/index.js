const multer = require('multer');
const { AuthController } = require('../controller/AuthController');
var express = require('express');
const authController = new AuthController()
var router = express.Router();
const upload = require('../middleware/multer');


router.get('/', authController.getHome)
router.get('/users', authController.getUsers);
router.get('/user/:id', authController.getUser);
router.get('/auth/register', authController.getRegister);
router.get('/logged/:id', authController.getLogged)
router.post('/auth/register', upload.single('avatar'), authController.postUser)
router.get('/auth/login', authController.getLogin)
router.post('/auth/login', authController.postLogin)
router.post("/user/:id/avatar", upload.single('avatar'), authController.addPhoto)

router.delete('/delete/:id', authController.deleteUser)
router.patch('/edit/:id', authController.editUser)



module.exports = router;
