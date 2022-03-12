const db = require ('../config/connection')
const collection = require ('../config/collections')
const { ObjectId, Collection } = require ('mongodb')

module.exports = {

doOtpLogin : (userdata) => {
    return new Promise (async (resolve , reject) => {

        const number = await db.get().collection(collection.USER_COLLECTION).findOne({user_number : userdata.user_number})

        if (!number) {
            return resolve ({status : false , errorMessage : "You Entered Wrong Mobile Number"})
        }

        return resolve ({status : true, user : number })

    
    })
}

}
