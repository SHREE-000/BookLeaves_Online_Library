const db = require ('../config/connection')
const collection = require ('../config/collections')
const { ObjectId, Collection } = require ('mongodb')
const { response } = require('express')

module.exports = {

doUserSignup : (userdata) => {

    let coupon = []

    return new Promise (async (resolve , reject) => {

        if (userdata.password != userdata.confirmpassword) {
            return resolve ({status : false , errorMessage : "Password Missmatch" })
        }

        const number = await db.get().collection(collection.USER_COLLECTION).findOne({user_number : userdata.user_number})

        if (number) {
            return resolve ({status : false , errorMessage : "Mobile Number Already Exists"})
        }

        const email = await db.get().collection(collection.USER_COLLECTION).findOne({user_email : userdata.user_email})

        if (email) {
            return resolve ({status : false , errorMessage : "Email Id Already Exists"})
        }

       
        else {
            db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then ( (response) => {
                db.get().collection(collection.USER_COLLECTION).updateOne(
                    {
                        _id : ObjectId(response.insertedId)
                    },

                    {
                        $set : {
                            isActivePlan : false ,
                            isActive : true ,
                            coupon
                        }
                    }
                )

                
                return resolve ({status : true , id : response.insertedId})
            })
            
        }
    })
}

}