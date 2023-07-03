const apiController = require('../controllers/apiController')
const express = require('express')
const app=express()
const router=express.Router()


router.get('/',apiController.home)
router.post('/signup',apiController.signup)
router.post('/login',apiController.login)
router.post('/forget-password',apiController.forgetPassword)
router.post('/change-password',apiController.chnagePassword)
module.exports = router