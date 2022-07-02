const { User } = require("../models/UserSchema")

const emailExistInDB = async( email ) => {
    const query = { email }
    const emailExist = await User.findOne({ where: query })
    if( emailExist ) throw new Error( `${ email } is already exist` )
}

const idExistsInDB = async( uid ) => {
    const query = { uid }
    const userExists = await User.findOne({ where: query })
    if( !userExists ) throw new Error( `The user with id: ${ id } is not exist` )
}

module.exports = {
    emailExistInDB,
    idExistsInDB
}