// Libraries
const { response, query } = require('express')
const { Task } = require('../models/TasksSchema')
const { User } = require('../models/UserSchema')

// Utils
const catchAsync = require('../utils/catchAsync')
const { verifyFinishDate, verifyStartDate } = require('../utils/verifyDates')


const getAllTask = catchAsync(async( req, res = response, next ) => {

    const { limit, offset } = req.query
    const [ total, tasks ] = await Promise.all([
        Task.count(),
        Task.findAll({ 
            include: [{
                model: User,
                attributes: [ 'uid', 'name', 'email', 'status' ] 
            }],
            attributes: [ 
                'id',
                'title', 
                'limitDate', 
                'startDate', 
                'finishDate', 
                'status'  
            ],
            limit,
            offset
        })
    ])

    res.status( 200 ).json({
        total,
        tasks
    })
})

const getTaskByStatus = catchAsync(async( req, res = response, next ) => {

    const { offset, limit } = req.query
    const { status } = req.params

    const [ total, tasks ] = await Promise.all([
        Task.count({ where: { status } }),
        Task.findAll({ 
            include: [{
                model: User,
                attributes: [ 'uid', 'name', 'email', 'status' ] 
            }],
            attributes: [ 
                'id',
                'title', 
                'limitDate', 
                'startDate', 
                'finishDate', 
                'status'  
            ],
            where: { status },
            limit,
            offset
        })
    ])

    res.status( 200 ).json({
       total,
       tasks
    })
})

const createTask = catchAsync(async( req, res = response, next ) => {

    const { userId, title, limitDate } = req.body

    // Create Task
    const newTask = Task.build({ userId, title, limitDate })
    await newTask.save()

    res.status( 200 ).json({
        newTask
    })
})

const updateTask = catchAsync(async( req, res = response, next ) => {

    const { id } = req.params
    const { startDate, finishDate, limitDate } = req.body

    const taskToUpdate = await Task.findOne({ 
        where: { id }, 
        attributes: [ 
            'id', 
            'userId', 
            'title', 
            'limitDate', 
            'startDate', 
            'finishDate' 
        ]
    })

    // Verify if start date is more than limitDate
    const isStartDateMoreThanLimit = verifyStartDate( startDate, taskToUpdate.limitDate)
    if( isStartDateMoreThanLimit ){
        return res.status( 401 ).json({
            ok: false,
            msg: 'The start date cannot be more than the limit date'
        })
    }

    // Verify and update values of [ startDate, finishDate, limitDate ]
    if( startDate.length > 0 ){
        await taskToUpdate.update({ startDate })
    }
    if( finishDate.length > 0 ){
        await taskToUpdate.update({ 
            finishDate, 
            status: verifyFinishDate( finishDate, taskToUpdate.limitDate )
        })
     }
    if( limitDate.length > 0 ){
        await taskToUpdate.update({ limitDate })
    }

    res.status( 200 ).json({
        taskToUpdate
    })
})

const cancellTask = catchAsync(async( req, res = response, next ) => {

    const { id } = req.params

    const taskToDelete = await Task.findOne({ where: { id } })
    await taskToDelete.update({ status: 'cancelled' })

    res.status( 200 ).json({
        taskToDelete
    })
})

module.exports = {
    getAllTask,
    getTaskByStatus,
    createTask,
    updateTask,
    cancellTask
}