const multer = require('multer');
const { AuthController } = require('../controller/AuthController');
var express = require('express');
const authController = new AuthController()
var router = express.Router();
const path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })


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
