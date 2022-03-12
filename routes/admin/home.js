const express = require ('express')
const { route } = require('..')
const router = express.Router()
var productHelpers = require ('../../helpers/admin_product')

router.use((req, res, next) => {

    if (req.session.admin) {
        let admin = req.session.admin
        next()
    }else{
        res.redirect('/a-login')

    }
})

router.get ('/', async(req , res) => {

    let totalCount = 0
    let totalSum = 0
    let countPercentage = []
    let subscriptionPercentage = []
    let sumOfSubscription
    let countOfState
    let state
    let userState

    let userDetails =  await productHelpers.userDataUsingState()

    if (userDetails) {

    userState = userDetails.userState
    state = userDetails.state
    countOfState = userDetails.countOfState
    sumOfSubscription = userDetails.sumOfSubscription
    totalCount = 0
    totalSum = 0
    countPercentage = []
    subscriptionPercentage = []

    for (let x = 0; x < countOfState.length; x++) {
        totalCount = countOfState[x] + totalCount   
    }
    for (let x = 0; x < sumOfSubscription.length; x++) {
        totalSum = sumOfSubscription[x] + totalSum   
    }
    for (let x = 0; x < countOfState.length; x++) {
        countPercentage.push( (countOfState[x])*100/totalCount )
        subscriptionPercentage.push( (sumOfSubscription[x])*100/totalSum )
    }

    }
    else {
    totalCount = 1
    totalSum = 1
    countPercentage = 1
    subscriptionPercentage = 1
    sumOfSubscription = 1
    countOfState = 1
    state = 1
    userState = 1
    }
    

    let sum = 0

    dp = await productHelpers.findDP()
    const admin = req.session.admin
    let totalSubscription =  await productHelpers.findTotalPaidSubscription()
    let plans =  await productHelpers.findAllPlans()
    let numberOfCurrentSubscriptions = plans.length
    let numberOfTotalSubscription = totalSubscription.length
    
    let final =  await productHelpers.findTotalAmountPerMonth()

   
    for ( let i = 0; i < final.length; i++) {
        sum = sum + final[i]
    }
    monthyAverage = parseInt (sum/12);

    res.render ('admin/home', { admin , dp , monthyAverage , numberOfCurrentSubscriptions , countPercentage , 
        numberOfTotalSubscription , sum , admin_partial : true , userState , state , countOfState ,
        subscriptionPercentage , sumOfSubscription})
})

router.get ('/a-logout', (req , res) => {
 

    req.session.admin=null;
    res.redirect('/a-login')
  })






module.exports = router