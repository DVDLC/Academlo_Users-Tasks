// libraries
const bcrypt = require('bcryptjs')
const catchAsync = require('../utils/catchAsync')

const { User } = require('../models/UserSchema')
const { Task } = require('../models/TasksSchema')

const getAllUsers = async( req, res = response, next ) => {

    const { limit, offset } = req.query
    const query = { status: 'active' }
    const [ total, users ] = await Promise.all([
        User.count({ where: query }),
        User.findAll({  
            include: [{
                model: Task,
                attributes: [ 
                    'id',
                    'title', 
                    'limitDate', 
                    'startDate', 
                    'finishDate', 
                    'status'  
                ]
            }], 
            where: query,
            attributes: [ 'uid', 'name', 'email', 'status' ],
            offset,
            limit
        })
    ])

    res.status( 200 ).json({
        total,
        users
    })
}

const createUser = catchAsync(async( req, res = response, next ) => {
    
    let { password, ...rest } = req.body

    // Encrypt password
    const salt = bcrypt.genSaltSync( 10 )
    password = bcrypt.hashSync( password, salt )

    // Create User
    const newUser = User.build({ ...rest, password })
    await newUser.save()

    // change password to undefined
    newUser.password = undefined

    res.status( 200 ).json({
        newUser
    })
})

const updateUser = catchAsync(async( req, res = response, next ) => {
    
    const { uid } = req.params
    const { name, email } = req.body

    // User to update
    const userToUpdate = await User.findOne({ 
        where: { uid }, 
        attributes: [ 'uid', 'name', 'email', 'status' ] 
    })
    await userToUpdate.update({ name, email  })
    
    res.status( 200 ).json({
        userToUpdate
    })
})

const deleteUser = async( req, res = response, next ) => {
    
    const { uid } = req.params
    const { status } = req.body

    // User to update
    const userToDelete = await User.findOne({ where: { uid } })
    await userToDelete.update({ status })
    
    res.status( 200 ).json({
        userToDelete
    })
}

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}