const express = require('express')
const { db } = require('./db/db.config')

// Utils
const { globalErrorHandler } = require('./middlewares/globalErrorHandler')
// Models
const { Task } = require('./models/TasksSchema')
const { User } = require('./models/UserSchema')

class Server{
    constructor(){
        this.PORT = 8080
        this.app = express() 
        this.path = {
            users: '/api/v1/users/',
            tasks: '/api/v1/tasks/',
            error: '*'
        }

        //DB connection
        this.dbConnection()

        // Middlewares
        this.middlewares()

        // Routes
        this.routes()
    }

    middlewares(){
        this.app.use( express.json() )
    }


    routes(){
        this.app.use( this.path.users, require('./routes/user.routes') )
        this.app.use( this.path.tasks, require('./routes/tasks.routes') )

        this.app.use( this.path.error, globalErrorHandler )
    }


    listen(){
        this.app.listen( this.PORT || 4000, () => {
            console.log( `Server running at PORT: ${ this.PORT }` )  
        })
    }

    async dbConnection(){
        try{
            await Promise.all([
                db.authenticate(),
                db.sync(/* { force: true } */)
            ])

            // DB relations
            User.hasMany( Task, { foreignKey: 'userId' } )
            Task.belongsTo( User, { foreignKey: 'userId' } )

            console.log( 'DB authenticated and sync' )
        }catch( err ){
            console.log( 'Fail to connect to db', err )
        }
    }

}

module.exports = Server