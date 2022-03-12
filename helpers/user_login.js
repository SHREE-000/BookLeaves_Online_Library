const collection = require ('../config/collections')
const db = require ('../config/connection')
const { ObjectId } = require ('mongodb')
const async = require('hbs/lib/async')
const { response } = require('express')
const collections = require('../config/collections')

module.exports = {

doUserLogin : (userdata) => {

    console.log(userdata , "userdata from db");
    return new Promise ( async (resolve , reject) => {

        const response = {}

        const user = await db.get().collection(collection.USER_COLLECTION).findOne ( {
            user_email : userdata.user_email , user_password : userdata.user_password , isActive : true
        })

        if (user) {
            response.status = true
            response.user = user
            return resolve (response)   
        }else {

            const emailUser = await db.get().collection(collection.USER_COLLECTION).findOne( {user_email : userdata.user_email} )

            if (!emailUser) {
                return resolve({errorMessage : "Invalid Email" , status : false})
            }


            const passwordUser = await db.get().collection(collection.USER_COLLECTION).findOne( {user_password : userdata.user_password})

            if (!passwordUser) {
                return resolve ( {errorMessage : "Invalid Password", status : false})
            }

            const disableUser = await db.get().collection(collection.USER_COLLECTION).findOne ( {user_email : userdata.user_email , user_password : userdata.user_password} )

            if (!disableUser) {
                return resolve ( {errorMessage : "Your Account Has Been Blocked", status : false} )
            }

            return resolve ( {errorMessage : "User Not Found", status : false})
        }
    })
}

}