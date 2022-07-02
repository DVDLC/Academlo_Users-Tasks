const { Router } = require("express");
const { check, query } = require("express-validator");
// Controllers
const { 
    getAllUsers, 
    createUser, 
    updateUser, 
    deleteUser } = require("../controllers/user.controller");

// Middlewares
const { emailExistInDB } = require("../middlewares/dbCustomMiddlewares");
const validateConfig = require("../middlewares/validateErrors");

const router = Router()

router.get( '/', getAllUsers )

router.post( '/', [
    check( 'name', 'Name is required' ).not().isEmpty(),
    check( 'email', 'Email invalid' ).isEmail(),
    check( 'email' ).custom( emailExistInDB ),
    check( 'password', 'Name is required' ).not().isEmpty(),
    validateConfig
], createUser )

router.patch( '/:uid', [
    check( 'email', 'Email invalid' ).isEmail(),
    validateConfig
], updateUser )

router.delete( '/:uid', deleteUser )


module.exports = router