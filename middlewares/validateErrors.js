const { validationResult } = require("express-validator")

   
const validateConfig = (req, res, next) => {

    // Verificacion de los middlewares con express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json(errors)
    }
    next()
}

module.exports = validateConfig