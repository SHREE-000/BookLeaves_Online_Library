const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelpers = require ('../helpers/admin_product')
var moment = require ('moment')
const paypal = require('paypal-rest-sdk'); 
const { resolve } = require('promise');
const schedule = require('node-schedule');
const { Db } = require('mongodb');
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})


paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AdY0khx1uxYu4HS3UJsnt_-AgNUCy2PsV6PbvX8W66fbLedU699d4WVYIZEq2k988aBgm-MUP_pGynkq',
  'client_secret': 'EHvW5lXVGsh92R6nsEmjAeY0B3vv24YUTeqtgsIfMQi6v69ArYqc9A0eHUY6uDm3OiHwVhgKKM5j4afQ'
});





const verifyLogin = ( (req,res,next) =>{

  if(req.session.user) {
    next()
  }
  else {
    res.redirect('/u-login')
  }
})

/* GET home page. */
router.get('/' ,  async(req, res, next) => {

  const bookDetails = await productHelpers.getAllProduct()
  const book = bookDetails.book 
  
  let details = await productHelpers.findFirstBanner()
  let firstBannerDetails = details.firstBanner
  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  let wishlistCount
  

  if (req.session.user) {
  wishlistCount = await productHelpers.getWishlistCount(req.session.user._id)
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate

  const secondBannerr = await productHelpers.findSecondBanner()
  const secondBanner = secondBannerr.secondBanner
  let detailss = await productHelpers.findAuthorBanner()
  let authorBannerDetails = detailss.authorBanner
  let promotiondetails = await productHelpers.findpromotionBanner()
  let promotionBannerDetails = promotiondetails.promotionBanner
  let lastdetails = await productHelpers.findpromotionLast()
  let lastpromotionBannerDetails = lastdetails.lastpromotionBanner 
  let coupondetails = await productHelpers.findCouponBanner()
  let couponBannerDetails = coupondetails.couponBanner
  let findCategory = await productHelpers.findCategory() 
  let category = findCategory.category

  const user = req.session.user
  res.render('index', {  title: 'Bookleaves' , user , book , user_partial : true ,  
  authorBannerDetails , firstBannerDetails , secondBanner , promotionBannerDetails , 
  lastpromotionBannerDetails , cartCount , couponBannerDetails , category ,
   totalRate ,shiprate , oneBook , wishlistCount});

  
});


// logout router

router.get ('/u-logout' , (req,res) => {
  req.session.user = null
  res.redirect('/u-login')
})

// product details page

router.get('/product-details/:id',verifyLogin , async(req , res) => {

  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate

  const id = req.params.id

  productHelpers.findOneProduct(id).then( (response) => { 
    const oneBook = response.oneBook
    res.render('user/product-details', {user_partial : true , oneBook, user : req.session.user ,
      shiprate , cartCount , totalRate })
  })
})

// add to cart

router.get('/cart', verifyLogin , async(req,res) =>{
  
  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate
 

  res.render('user/cart', {user_partial : true, oneBook , user : req.session.user, shiprate , cartCount , totalRate})
})


 router.get('/add-to-cart/:id'   ,verifyLogin,async (req,res) => {
  await productHelpers.addCart(req.params.id , req.session.user._id)
  let shiprate = await productHelpers.findDeliveryRate()  
  let cartCount = await productHelpers.getCartCount(req.session.user._id)
  let onBook = await productHelpers.getCartItem(req.session.user._id)
  let oneBook = onBook[0]
  console.log(oneBook , "from cart");
  let totalRate = cartCount * shiprate
   res.json({status:true , oneBook , totalRate ,shiprate , cartCount}) 
  })

 router.post('/delete-cart-product', (req,res) => {
   productHelpers.deleteCart(req.body.proId , req.session.user._id).then( (response) => {
     res.json({status:true})
   })
 })

//  wishlist

router.get('/wishlist' , verifyLogin ,async (req,res) => {

  let cartCount = null
  let totalRate = null
  let shiprate

  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 

  }
 
  totalRate = cartCount * shiprate

  let onBook = await productHelpers.getWishItem(req.session.user._id)
  let oneBook = onBook[0]

  res.render('user/wishlist' , {user_partial : true , shiprate , oneBook , user : req.session.user  , cartCount , totalRate} )
})

router.get('/add-to-wishlist/:id'  , verifyLogin , async (req,res) => {
  await productHelpers.addWishlist(req.params.id , req.session.user._id)  

  let wishlistCount = await productHelpers.getWishlistCount(req.session.user._id)
   res.json({status:true , wishlistCount }) 
  })

  router.post('/delete-wishlist-product', verifyLogin ,(req,res) => {
    productHelpers.deleteWishlist(req.body.proId , req.session.user._id).then( (response) => {
      res.json({status:true})
    })
  })




// Profile Page - add ,  edit , delete address


// edit profile

router.get('/edit-profile',verifyLogin, async(req,res) => {

  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate

res.render('user/edit-profile' , {user_partial : true , user : req.session.user , cartCount , totalRate , oneBook})
})

// add profile

router.get('/add-profile',verifyLogin, async(req,res) => {

  const successMessage = req.session.successMessage
  req.session.successMessage = null

  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate



res.render('user/add-profile' , {user_partial : true , user : req.session.user , cartCount , oneBook , totalRate , successMessage})
})


router.post('/add-profile',verifyLogin , async(req,res) => {

    if (req.session.user) {
    await productHelpers.addAddress(req.body , req.session.user._id).then ( (response) => {
      req.session.errorMessage = response.errorMessage
      req.session.successMessage = response.successMessage
      req.session.addressId = response.addressId

     

    }) }
res.redirect('/user-profile' )
})

// add profile in checkout page

router.post('/add-profile-checkout', verifyLogin ,async(req,res) => {

    if (req.session.user) {
    await productHelpers.addAddress(req.body , req.session.user._id).then ( (response) => {
      req.session.errorMessage = response.errorMessage
      req.session.successMessage = response.successMessage
      req.session.addressId = response.addressId

     

    }) }
res.redirect('/checkout' )
})

// user profile


router.get('/user-profile',verifyLogin, async(req,res) => {

  let address

  const errorMessage = req.session.errorMessage
  req.session.errorMessage = null
  const successMessage = req.session.successMessage
  req.session.successMessage = null

  

  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate

    await productHelpers.getUserAddress(req.session.user._id).then( (response) => {
      address = response
    })

    if (address) {
      res.render('user/user-profile' , {user_partial : true , user : req.session.user , cartCount , totalRate ,
        errorMessage , successMessage ,oneBook , address})
    }
    else {
      req.session.successMessage = "Please Add Your Address, You Haven't Added  Yet"
      res.redirect ('/add-profile')
    }
    
   


})

// delete address

router.get('/delete-profile/:id',verifyLogin , async (req,res) => {

  if (req.session.user) {
  await productHelpers.deleteAddress(req.session.user._id , req.params.id).then( (response) => {
    
    req.session.successMessage =  response
  })
  }
  res.redirect('/user-profile')
}) 

// edit address

router.get('/edit-profile/:id',verifyLogin, async(req,res) => {


  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0] 
  }
  addressDetails = await productHelpers.getOneAddress(  req.params.id , req.session.user._id  ) 


 
  totalRate = cartCount * shiprate

res.render('user/edit-profile' , {user_partial : true , user : req.session.user , cartCount , totalRate ,
   addressDetails ,  oneBook })
})



router.post('/edit-profile' ,verifyLogin , async(req,res) => {
  if (req.session.user) {
    const message = await productHelpers.editAddress(req.session.user._id , req.body)

    req.session.successMessage = message.successMessage

  }
  res.redirect('/user-profile')
})

// place order

router.get('/place-order',verifyLogin, async(req,res) => {
  const user = await productHelpers.getUser(req.session.user._id)
  const userId = user._id
  let rent = false
  const errorMessage = req.session.errorMessage 
  req.session.errorMessage = null
  await productHelpers.destroyCart(userId)
   .then( (response) => {
     if(response.status) {
       rent = true
     }
   })
  res.render('user/place-order', { user : req.session.user , errorMessage ,  user_partial : true  , rent})
})

// place order for subscription

router.get('/place-order-subscription' , verifyLogin , async (req,res)=> {

  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate

  res.render('user/place-order-subscription' , {user_partial : true , user : req.session.user ,
     oneBook , totalRate , shiprate , cartCount})
})


// view orders

router.get('/view-order',verifyLogin , async (req,res) => {
  const succesMessage = req.session.succesMessage
  req.session.succesMessage = null
 const orders = await productHelpers.userOrderDetails(req.session.user._id)
 let isActive = "Pending"


 if (orders[0].status == "Placed") {
   isActive = true
 }


 for( x of orders) {
   x.date = moment (x.date).format("ll")
 }
    res.render('user/view-order',{user : req.session.user , isActive , succesMessage ,  user_partial : true  , orders})

  })

  // cancell orderd books

  router.get('/cancel-order/:id' , verifyLogin , async (req,res) => {
    
    id = req.params.id
 
    const msg = await productHelpers.changePaymentStatusByUser(req.session.user._id , id)
    req.session.successMessage = msg
    res.redirect('/view-order')
  })

  // ordered book details

  router.get('/order-book-details' ,verifyLogin, async (req,res) => {
  
 const orders = await productHelpers.userOrderDetails(req.session.user._id)

 for( x of orders) {
  x.date = moment (x.date).format("ll")
}

    res.render('user/order-book-details', {user : req.session.user , user_partial : true  , orders})
  })

  // add , edit , delete profile page not address

  router.get('/profile', verifyLogin, async(req,res) =>{

   
    let cartCount = null
    let totalRate = null
    let shiprate
    let onBook 
    let oneBook
    
  
    if (req.session.user) {
    cartCount = await productHelpers.getCartCount(req.session.user._id) 
    shiprate = await productHelpers.findDeliveryRate() 
    onBook = await productHelpers.getCartItem(req.session.user._id)
    oneBook = onBook[0] 
    }

  
    totalRate = cartCount * shiprate

    let userData

    await productHelpers.getUser(req.session.user._id).then( (response) => {
      userData = response
    })

      
     
      const user = req.session.user

      const successMessage = req.session.successMessage
      req.session.successMessage = null

   
    res.render('user/profile' , {user_partial : true , user : req.session.user, userData , oneBook , totalRate , cartCount , shiprate , user , successMessage})
  })

  router.post('/profile', verifyLogin ,async(req,res)=> {

    

    res.redirect('/editProfile')
  })


   // edit true profile page

  router.get('/editProfile',verifyLogin, async (req,res) => {

    console.log( req.session.profileId  , "edit profile from router");
    req.session.profileId = null

    let cartCount = null
    let totalRate = null
    let shiprate
    let onBook 
    let oneBook
  
    if (req.session.user) {
    cartCount = await productHelpers.getCartCount(req.session.user._id) 
    shiprate = await productHelpers.findDeliveryRate() 
    onBook = await productHelpers.getCartItem(req.session.user._id)
    oneBook = onBook[0] 
    }
      totalRate = cartCount * shiprate

    const user = await productHelpers.getUser(req.session.user._id)
 

    res.render('user/editProfile', {user, user_partial : true , oneBook , shiprate , user : req.session.user, onBook ,totalRate })
  })

  router.post('/editProfile',verifyLogin, async (req,res) => {



    const id = req.session.user._id

    const img1 = req.files.image1
  
    if (img1) {
      let params={
          Bucket:process.env.AWS_BUCKET_NAME,
          Key:  id + '1.jpeg',
          Body:img1.data
      }

      s3.upload(params, (err, data) => {
          if (err) {


              console.log(err, 'Profile Uplad Err  :1');
          } else {


              console.log(data, 'IMAGE FOUR SUCCESSFULLY UPLOADED');
          }
      })
  }


    req.session.successMessage = await productHelpers.updateUserData(req.session.user._id , req.body)

    res.redirect('/profile')
  })

  // Subscription Plans
 
  router.get('/subscription', verifyLogin , async(req,res) => {

    let cartCount = null
    let totalRate = null
    let shiprate
    let onBook 
    let oneBook
    
  
    if (req.session.user) {
    cartCount = await productHelpers.getCartCount(req.session.user._id) 
    shiprate = await productHelpers.findDeliveryRate() 
    onBook = await productHelpers.getCartItem(req.session.user._id)
    oneBook = onBook[0]
    }
   
    totalRate = cartCount * shiprate

    const subscription_plans = await productHelpers.findPlans()
    res.render('user/subscription' , {user_partial : true , subscription_plans , user : req.session.user ,
      oneBook , totalRate , cartCount , shiprate })
  })

  router.post('/subscription', verifyLogin ,async(req,res) => {

    // console.log(req.body , "body from subscription");
  
   
    const plan = await productHelpers.findOnePlanForCheckout(req.body)


    req.session.rate = req.body.subscription_rate
    req.session.plan = plan.planTitle 

  
    res.redirect('/checkout-subscription')
  })


  //  checkout page

router.get('/checkout', verifyLogin , async(req,res) => {

  let address

  const specified_plan = await productHelpers.findFirstUserPlans(req.session.user._id)
  let maxCount = parseInt (specified_plan.maxCountBooks)
  const order = await productHelpers.userOrderDetails(req.session.user._id)
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  let count = 0
  for(let x = 0; x < order.length; x++) {
    if (order[x].status == "Cancelled") {
    }
    else {
      count = count + 1
    }
  }
req.session.rentCount = count

let trueCount = count + cartCount

if ( maxCount > trueCount || maxCount == trueCount ) {

  
  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  let errorMessage
  let nullBook 

  user_details = await productHelpers.getUser(req.session.user._id)


  const successMessage = req.session.successMessage
  req.session.successMessage = null
  errorMessage = req.session.errorMessage
  req.session.errorMessage = null 
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate
    
    await productHelpers.getUserAddress(req.session.user._id).then( (response) => {
      address = response
    })

    // if (!address) {
    //   res.redirect ('/add-profile')
    // }
 
  
  if (totalRate === 0) {
    errorMessage = "You haven't place any order"
    nullBook = true
  }else {
    nullBook = false
  }
 

  res.render('user/checkout', {user_partial : true , cartCount  , errorMessage ,user_details ,
     successMessage ,totalRate ,oneBook , shiprate , address  , nullBook , user : req.session.user} )

  }

  else  {
    res.redirect('/cart')
  }

})



router.post('/checkout',verifyLogin, async(req,res) => {


  let shiprate = await productHelpers.findDeliveryRate()

  let onBook
  let oneBook
  let cartCount = null
  let deliveryAddress


  if (req.session.user) {
    cartCount = await productHelpers.getCartCount(req.session.user._id)
     onBook = await productHelpers.getCartItem(req.session.user._id)
     oneBook = onBook[0].cartItems 
     bookId = onBook[0].user

     
     
    await productHelpers.getCheckoutAddress(req.session.user._id , req.body.selectAddress).then( (response) => {
      deliveryAddress = response
    })
  }
  totalRate = cartCount * shiprate

  const user = await productHelpers.getUser(req.session.user._id)
    const plan = user.plan
  
  
  await productHelpers.checkOut(req.body , plan , req.session.user._id , deliveryAddress , oneBook , totalRate ,shiprate, bookId ,cartCount).then( (placeId) => {
    req.session.successMessage = placeId.successMessage
    req.session.errorMessage = placeId.errorMessage 
    
    const id = placeId.id 
    
    if (req.body['payment'] === 'COD') {
      res.json({COD_Success : true })
    }
    else if (req.body['payment'] === 'RazorPay') {
      productHelpers.generateRazorpay(id , totalRate).then( (response)=> {
        res.json(response)
      })
    }
    else {
        // req.sesson.id = id
        console.log(req.body , "from paypal");
        res.json({payPal_success : true})

    }

  })




})

// verify payment razorpay

router.post('/verify-payment', verifyLogin ,async (req,res) => {


  await productHelpers.verifyPayment(req.body).then( (response) => {
 
    productHelpers.changePaymentStatus(req.body['order[receipt]']).then( (response) => {
      
      res.json({status : true})
    })

  }).catch( (err) =>{
    console.log(err);
    res.json({status : false , errorMessage : "Payment Failed Unexpectedly"})
  })
})

// verify payment paypal

router.get('/payPal', (req, res) => {
  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Red Sox Hat",
                "sku": "001",
                "price": "25.00",
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total": "25.00"
        },
        "description": "Hat for the best team ever"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
      throw error;
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          res.redirect(payment.links[i].href);
        }
      }
  }
});

});

router.get('/success', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": "25.00"
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        res.redirect('/place-order-subscription');
    }
});
});

router.get('/cancel', (req, res) => res.send('Cancelled'));



  // Check out page for subscription

  router.get('/checkout-subscription',verifyLogin , async(req,res) => {

    let cartCount = null
    let totalRate = null
    let shiprate
    let onBook 
    let oneBook
    
  
    if (req.session.user) {
    cartCount = await productHelpers.getCartCount(req.session.user._id) 
    shiprate = await productHelpers.findDeliveryRate() 
    onBook = await productHelpers.getCartItem(req.session.user._id)
    oneBook = onBook[0]
    }
   
    totalRate = cartCount * shiprate

    
    const subscription_rate = req.session.rate
    const subscription_plan = req.session.plan
    const discountedRate = req.session.discountedRate
    // req.session.discountedRate = null
    const finalAmount = req.session.finalAmount
    // req.session.finalAmount = null
    const errorMessage = req.session.errorMessage 
    req.session.errorMessage = null
   
    res.render('user/checkout-subscription', {user_partial : true , errorMessage , subscription_rate , shiprate ,
      finalAmount, discountedRate ,  subscription_plan , oneBook , totalRate  , cartCount ,user : req.session.user})
  })

  router.post('/checkout-subscription', verifyLogin , async(req,res) => {


    await productHelpers.addCouponUser(req.session.user._id , req.body.coupon) 




    const subscription_rate = req.session.rate
   
    const subscription_plan = req.session.plan

    let validity = null
    let yearly_rate = null
    
    let plan = await productHelpers.findPlans()

    await plan.map( (result) => {

      if (result.monthlyRate == subscription_rate) {
        validity = "month"
      }
      else if (result.yearlyRate == subscription_rate) {
        validity = "year"
      }
      else {
          console.log("value not found");
      }
  })
  
    const userState = await productHelpers.getUser(req.session.user._id)  
    const state = userState.user_state
  

    const orderId = await productHelpers
    .checkOut_subscription(req.session.user._id  , req.body , subscription_rate , subscription_plan , validity , state)
    
   
    const msg = await productHelpers.updatePlanForUser(orderId , req.session.user._id)
   
      if (req.body.payment == 'RazorPay') {
          await productHelpers.generateRazorPayForPlan(orderId , subscription_rate).then( (response) => {
            response.status = true
          res.json(response)
          })
    }
    if ( req.body.payment == 'PayPal' ) {
      res.json({response : false})
    }

  
     
  
  
    // res.json({status : false , subscription_rate , orderId})
})

// verify payment razorpay for subscription plan

router.post('/verify-payment-subsciption',verifyLogin ,async (req,res) => {

  


  await productHelpers.verifyPaymentSubscription(req.body).then( async(response) => {
 
    await productHelpers.changePaymentStatusForSubscription(req.body['order[receipt]'] , req.session.user._id).then( (response) => {
      
      res.json({status : true})
    })

  }).catch( (err) =>{
    console.log(err);
    res.json({status : false , errorMessage : "Payment Failed Unexpectedly"})
  })

})


// contact form

router.get('/contact', verifyLogin , async (req,res) => {

  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate

  res.render('user/contact', {user_partial : true , user : req.session.user , oneBook , totalRate ,shiprate ,cartCount})
})

// searched_contents Page for index

router.post('/searched-contents', verifyLogin , async (req,res) => {

  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate

  const searchedProducts =  await productHelpers.viewProductUsingRegex(req.body.search_key_word)
 
  req.session.errorMessage = searchedProducts.errorMessage
  const errorMessage = req.session.errorMessage 
  req.session.errorMessage = null
  console.log(errorMessage , "abc from contact");
  res.render('user/searched_contents', {user_partial : true  , searchedProducts , user : req.session.user ,
    oneBook , totalRate , cartCount , errorMessage , shiprate })
})

// coupons

router.get ('/coupon-view',verifyLogin,async (req,res) => {

  let cartCount = null
  let totalRate = null
  let shiprate
  let onBook 
  let oneBook
  

  if (req.session.user) {
  cartCount = await productHelpers.getCartCount(req.session.user._id) 
  shiprate = await productHelpers.findDeliveryRate() 
  onBook = await productHelpers.getCartItem(req.session.user._id)
  oneBook = onBook[0]
  }
 
  totalRate = cartCount * shiprate

  const successMessage = req.session.successMessage
  req.session.successMessage = null
  const coupon = await productHelpers.findCoupon()
  const planTitle = req.session.planTitle
  for( x of coupon) {
    x.validity = moment (x.validity).format("ll")
  }

  res.render('user/coupon-view' , {successMessage ,user_partial : true , user : req.session.user ,
    oneBook , totalRate , cartCount , shiprate ,  planTitle , coupon})
})

// getting  offer coupon from database

  router.post ('/gettingCoupon',verifyLogin , async (req,res) => {

    

    let coupon = await productHelpers.findCouponinUser( req.session.user._id , req.body.givenCode) 
      await productHelpers.findCouponUsingCode(req.body.givenCode).then ( (response) => {
        console.log(response , "respoonse");
        let code = req.body.givenCode
        let offPercentage = null
        let discountedRate = 0
        let finalAmount = 0 
        let msg = "Wrong Coupon Code"
        let newGivenRate = req.body.newGivenRate
  
        if (response.status) { 
          
          let rateFromBackEnd = parseFloat(response.coupon.off_percentage)
          discountedRate = rateFromBackEnd * newGivenRate / 100;
          finalAmount = newGivenRate - discountedRate;
          
          req.session.discountedRate = discountedRate
          req.session.finalAmount = finalAmount
  
        res.json({code,discountedRate,finalAmount,coupon,status:true})
         
        }
        else{  
          res.json({status : false , newGivenRate})
      }
  
      })

  })

  // subscription orders

  router.get('/subscription_order' , verifyLogin , async (req,res) => {

    let cartCount = null
    let totalRate = null
    let shiprate
    let onBook 
    let oneBook
    
  
    if (req.session.user) {
    cartCount = await productHelpers.getCartCount(req.session.user._id) 
    shiprate = await productHelpers.findDeliveryRate() 
    onBook = await productHelpers.getCartItem(req.session.user._id)
    oneBook = onBook[0]
    }
   
    totalRate = cartCount * shiprate


    let fine 
    let fineAmountForOneDay
    let fineAmount

    const errorMessage = req.session.errorMessage
    
    
    
    let returnBook = await productHelpers.findMatchedReturnBook(req.session.user._id)




    if (returnBook) {
     



for ( let x = 0; x < returnBook.length; x++ ) {
   let date = new Date (returnBook[x].returnDate) - new Date (returnBook[x].planEndDate)
   
   fine = parseInt ((date * returnBook[x].fineAmountForOneDay) / (1000 * 60 * 60 * 24))
}

if (fine > 0) {
  fineAmount = returnBook
}

        for( let x of returnBook) {
            x.date = moment (x.date).format("ll")
            x.planEndDate = moment (x.planEndDate).format("ll")
        }
      }



    

    const succesMessage = req.session.succesMessage
    req.session.succesMessage = null
    const orders = await productHelpers.userOrderDetails(req.session.user._id)

  

   for( x of orders) {
     x.date = moment (x.date).format("ll")
   }

    const specified_plan = await productHelpers.findFirstUserPlans(req.session.user._id)
    let maxCount = parseInt (specified_plan.maxCountBooks)
    const order = await productHelpers.userOrderDetails(req.session.user._id)

    let count = 0
    for(let x = 0; x < order.length; x++) {
      if (order[x].status == "Cancelled") {

      }
      else {
        count = count + 1
      }
    }

   


    let remainingCount = maxCount - count
  
    res.render('user/subscription_order' , {specified_plan  , fineAmount , errorMessage , orders , 
      succesMessage , remainingCount , count , user : req.session.user , fine , user_partial : true ,
      oneBook , totalRate , cartCount , shiprate })
  })


  router.get ('/checkout-fetch' , verifyLogin , async (req,res) => {

    let maxCount
    let trueCount

    const specified_plan = await productHelpers.findFirstUserPlans(req.session.user._id)
    if (specified_plan.nill_plan) {
      maxCount = 0
    }
    else {
      
      maxCount = parseInt (specified_plan.maxCountBooks)
      const order = await productHelpers.userOrderDetails(req.session.user._id)
      cartCount = await productHelpers.getCartCount(req.session.user._id) 
      let count = 0
      for(let x = 0; x < order.length; x++) {
        if (order[x].status == "Cancelled") {
        }
        else {
          count = count + 1
        }
      }
    
    trueCount = count + cartCount
  
    }
    res.json({trueCount , maxCount})

  })

  // return order

  router.get('/return-order/:bookId/:userId/:status', verifyLogin, async (req,res) => {

    let bookId = req.params.bookId
    let userId = req.params.userId
    let status = req.params.status

    const one = await productHelpers.returnOrdrByUser( bookId , userId )
    const oneOrder = one.order
    const oneBook = one.book
    one.errorMessage = req.session.errorMessage


 
      await productHelpers.returnBooks(oneOrder.book ,  
      oneOrder.userOriginalId , oneBook[0]._id, oneOrder.date ,
       oneOrder.plan , userId , oneBook[0].fine.fine_amount)
    
    
    res.redirect('/subscription_order')
  })


module.exports = router;
