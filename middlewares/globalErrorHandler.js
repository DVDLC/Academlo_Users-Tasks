
const globalErrorHandler = ( err, req, res, next ) => {

    return res.status( 500 ).json({
        status: 'fail',
        msg: 'Something went wrong'
    })
} 

module.exports = { globalErrorHandler }