const verifyFinishDate = ( dateToVerify , limitDate ) => {
    return ( Date.parse( dateToVerify ) > Date.parse( limitDate ) )
        ? 'late' 
        : 'completed'
}

const verifyStartDate = ( dateToVerify, limitDate ) => {
    return ( Date.parse( dateToVerify ) > Date.parse( limitDate ) )
        ? true 
        : false
}


module.exports = {
    verifyFinishDate,
    verifyStartDate
}