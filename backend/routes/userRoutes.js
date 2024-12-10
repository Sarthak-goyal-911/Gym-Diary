const express = require('express')
const userControllers = require("../controllers/userControllesrs")
const auth = require("../middleware/credential_validation")

const router = express.Router()
// sign up r(outes
router.post ("/signup",auth.signupValidation,userControllers.signup)
router.post("/login",auth.loginValidation,userControllers.login)

// login routes
module.exports = router