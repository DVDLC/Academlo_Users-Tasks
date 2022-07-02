const { Router } = require("express");
const { check } = require("express-validator");
const { 
    getAllTask, 
    getTaskByStatus, 
    createTask, 
    updateTask, 
    cancellTask } = require("../controllers/task.controller");
const { idExistsInDB } = require("../middlewares/dbCustomMiddlewares");
const validateConfig = require("../middlewares/validateErrors");

const router = Router()

router.get( '/', getAllTask )

router.get( '/:status', getTaskByStatus )

router.post( '/', [
    check( 'userId', 'userId is required' ).not().isEmpty(),
    check( 'userId' ).custom( idExistsInDB ),
    validateConfig
], createTask )

router.patch( '/:id', updateTask )

router.delete( '/:id', cancellTask )


module.exports = router