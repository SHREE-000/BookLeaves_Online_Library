const db = require ('../config/connection')
const collection = require ('../config/collections')
const { ObjectId, Collection } = require ('mongodb')

module.exports = {

doAdminOtp : (adminData) => {
    return new Promise (async (resolve , reject) => {

        const number = await db.get().collection(collection.ADMIN_COLLECTION).findOne({admin_number : adminData.admin_number})

        if (!number) {
            return resolve ({status : false , errorMessage : "You Entered Wrong Mobile Number"})
        }

        return resolve ({status : true, admin : number })

    
    })
}

}
