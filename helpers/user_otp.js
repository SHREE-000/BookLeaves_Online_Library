const db = require ('../config/connection')
const collection = require ('../config/collections')
const { ObjectId, Collection } = require ('mongodb')

module.exports = {

doUserOtp : (userdata) => {
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

        userdata.isActive = true
        db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then( (data) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id : data.insertedId}).then((user) =>{
                resolve ({status : true , successMessage : "Your Account Created Successfully" , userId : data.insertedId, user })
            })
        })
    })
}

}