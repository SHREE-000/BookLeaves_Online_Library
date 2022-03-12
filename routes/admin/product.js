const { response } = require('express')
const express = require ('express')
const { Db } = require('mongodb')
const { post } = require('..')
const router = express.Router()
var moment = require ('moment')
const adminCategoryHelpers = require ('../../helpers/admin_product')
const { order } = require('paypal-rest-sdk')
const schedule = require('node-schedule');



const verifyLogin = ( (req,res,next) =>{

    if(req.session.admin) {
        let admin = req.session.admin
      next()
    }
    else {
      res.redirect('/a-login')
    }
  })

// add , find , delete category

router.get ('/',verifyLogin , async (req , res) => {

    let findCategory = await adminCategoryHelpers.findCategory() 
    let category = findCategory.category

    console.log(category , "idfhrgg");

    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    
    res.render ('admin/category' , {errorMessage , admin_partial : true , successMessage , category})
})

router.post ('/', (req , res) => {

    adminCategoryHelpers.doAdminCategory(req.session.admin._id , req.body).then( (response) => {

        if (response.status) {

        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage
        res.redirect('/a-product')
        }
})   
})

router.post('/delete-category',async (req,res) => {
    await adminCategoryHelpers.deleteCategory(req.body.book_category).then( (response) => {
        req.session.errorMessage = response.errorMessage
        res.redirect('/a-product')
    })
  })
  
  // add , find , delete sub-category

  router.get('/sub-category-json' , async (req,res) => {
    let findCategory = await adminCategoryHelpers.findCategory() 
      res.json()
  })

router.get ('/sub-category', verifyLogin , async (req , res) => {

 

    let findCategory = await adminCategoryHelpers.findCategory() 
    let category = findCategory.category

    let book_category = category.category
    let book_sub_category = category.book_sub_category

    let total_category = {
        book_category ,
        book_sub_category 
    }

    console.log(total_category , "from sub-category router");

    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    
    res.render ('admin/sub-category' , {errorMessage , successMessage , admin_partial : true , category , total_category})
})

router.post ('/sub-category', (req , res) => {

    console.log(req.body , " req.body from sub-category post method router");

    adminCategoryHelpers.doAdminSubCategory(req.body).then( (response) => {

        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage

        res.redirect ('/a-product/sub-category')   
})

})

router.post ('/delete-sub-category', async(req , res) => {

    await adminCategoryHelpers.deleteSubCategory(req.body).then( (response) => {

        if (response.status) {

        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage

        res.redirect ('/a-product/sub-category')
        

        }
})

})

// view book deatails 

router.get ('/product-view', verifyLogin , (req , res) => {
    adminCategoryHelpers.getAllProduct(req.body).then( (response) => {
        const book = response.book
        res.render ('admin/product-view' , {book , admin_partial : true})
    })
})

// add new book and details

router.get('/add-product' , verifyLogin ,  async (req , res) => {

    const categorry = await adminCategoryHelpers.findCategory()

    const category = categorry.category
        res.render ('admin/add-product' , {  category , admin_partial : true})
    
})

router.post('/add-product',async (req ,res) => {

    await adminCategoryHelpers.adminAddProduct(req.body , req.params.id).then(async(response) => {
      
        const id  = response.productId

        await adminCategoryHelpers.adminAddProductDate(id)

        const image1 = req.files.image1
        const image2 = req.files.image2
        const image3 = req.files.image3
        const image4 = req.files.image4

        if (image1) {
            image1.mv('./public/book-images/'+id+'1.jpeg')
        }
        if (image2) {
            image2.mv('./public/book-images/'+id+'2.jpeg')
        }
        if (image3) {
            image3.mv('./public/book-images/'+id+'3.jpeg')
        }
        if (image4) {
            image4.mv('./public/book-images/'+id+'4.jpeg')
        }
   
        res.redirect('/a-product/product-view')
    })

})

// edit book

router.get('/product-edit/:id', verifyLogin , async(req , res) => {


    const categorry = await adminCategoryHelpers.findCategory()
        const category = categorry.category
        

    const id = req.params.id
    adminCategoryHelpers.viewProduct(id).then((response) => {

        const book = response.book
        console.log(book);

        res.render('admin/product-edit', {book , category , admin_partial : true})

    })
    
    })

    router.post('/product-edit/:id', (req , res) => {
        adminCategoryHelpers.editProduct(req.params.id , req.body).then( (response) => {
            res.redirect('/a-product/product-view')
          
                
                const id = req.params.id

                const image1 = req.files.image1
                const image2 = req.files.image2
                const image3 = req.files.image3
                const image4 = req.files.image4

            if (image1) {
                image1.mv('./public/book-images/' +id+ '1.jpeg')
            }
            if (image2) {
                image2.mv('./public/book-images/' +id+ '2.jpeg')
            }
            if (image3) {
                image3.mv('./public/book-images/' +id+ '3.jpeg')
            }
            if (image4) {
                image4.mv('./public/book-images/' +id+ '4.jpeg')
            }
        })
    })
    

// delete book

router.get('/delete-product/:idd',verifyLogin ,  (req , res) => {
    const id = req.params.idd
    adminCategoryHelpers.deleteProduct(id).then((response) => {
        res.redirect('/a-product/product-view')
    })

    
})

// add delete delivery rate

router.get ('/add-delivery-rate', verifyLogin , async (req , res) => {

    let shiprate = await adminCategoryHelpers.findDeliveryRate()  

    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    
    res.render ('admin/Delivery-rate' , {errorMessage , successMessage , admin_partial : true , shiprate})
})

router.post ('/add-delivery-rate', (req , res) => {

    adminCategoryHelpers.addDeliveryRate(req.body).then( (response) => {

        if (response.status) {

        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage

        res.redirect ('/a-product/add-delivery-rate')
        

        }
})

})

router.post('/delete-delivery-rate', (req,res) => {
    adminCategoryHelpers.deleteDeliveryRate(req.body).then( (response) => {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage
        res.redirect('/a-product/add-delivery-rate')
    })
})

// admin banner management first

router.get('/banner-management', verifyLogin , async (req,res) => {

    let details = await adminCategoryHelpers.findFirstBanner()
    let firstBannerDetails = details.firstBanner
    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    res.render('admin/banner-management', {errorMessage , successMessage , admin_partial : true , firstBannerDetails})
})

router.post('/banner-management', (req,res) => {
    adminCategoryHelpers.addFirstBanner(req.body).then( (response) => {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage
        res.redirect('/a-product/banner-management')
    })
})

router.post('/banner-management/firstDelete', (req,res) => {
    adminCategoryHelpers.deleteFirstBanner(req.body).then( (response) => {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage
        res.redirect('/a-product/banner-management')
    })
})

// admin banner management second

router.get('/second-banner', verifyLogin , async (req,res) => {

    let details = await adminCategoryHelpers.findSecondBanner()
    let secondBannerDetails = details.secondBanner
    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    res.render('admin/secondBanner', {errorMessage , successMessage , admin_partial : true , secondBannerDetails})
})

router.post('/second-banner', (req,res) => {
    adminCategoryHelpers.addSecondBanner(req.body).then( (response) => {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage

        const id = response.secondBannerId

        const img1 = req.files.image1
        const img2 = req.files.image2

        console.log(img2 , img1 + "this is from image data");

        if (img1) {
            img1.mv('./public/second-banner-images/' + id + '1.jpeg')
        }

        if (img2) {
            img2.mv('./public/second-banner-images/' + id + '2.jpeg')
        }

        res.redirect('/a-product/second-banner')
    })
})

router.get('/delete-second-banner/:id', verifyLogin ,  (req,res) => {
    adminCategoryHelpers.deleteSecondBanner(req.params.id).then( (response)=> {
        console.log(req.params.id + "from delete second banner");
        req.session.errorMessage = response.errorMessage
        res.redirect('/a-product/second-banner')
    })
})


// admin banner management author

router.get('/author-banner', verifyLogin , async (req,res) => {

    let details = await adminCategoryHelpers.findAuthorBanner()
    let authorBannerDetails = details.authorBanner
    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    res.render('admin/author-banner', {errorMessage , successMessage , admin_partial : true , authorBannerDetails})
})

router.post('/author-banner',async (req,res) => {
    await adminCategoryHelpers.addAuthorBanner(req.body).then( (response) => {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage

        const id = response.authorBannerId

        const img1 = req.files.image1

        if (img1) {
            img1.mv('./public/author-images/' + id + '.jpeg')
        }

        res.redirect('/a-product/author-banner')
    })
})

router.get('/delete-author-banner/:id', verifyLogin , async (req,res) => {
    await adminCategoryHelpers.deleteAuthorBanner(req.params.id).then( (response)=> {
        req.session.errorMessage = response.errorMessage
        res.redirect('/a-product/author-banner')
    })
})

// admin banner management promotion

router.get('/promotion-banner', verifyLogin , async (req,res) => {

    let details = await adminCategoryHelpers.findpromotionBanner()
    let promotionBannerDetails = details.promotionBanner 
    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    res.render('admin/promotion-banner', {errorMessage , successMessage , admin_partial : true , promotionBannerDetails })
})

    router.post('/promotion-banner',async (req,res) => {
    await adminCategoryHelpers.addpromotionBanner(req.body).then( (response) => {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage

        const id = response.promotionBannerId

        const img1 = req.files.image1
        const img2 = req.files.image2

        if (img1) {
            img1.mv('./public/promotion-images/' + id + '1.jpeg')
        }
        if (img2) {
            img1.mv('./public/promotion-images/' + id + '2.jpeg')
        }

        res.redirect('/a-product/promotion-banner')
    })
})

router.get('/delete-promotion-banner/:id', verifyLogin , async (req,res) => {
    await adminCategoryHelpers.deletepromotionBanner(req.params.id).then( (response)=> {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage
        res.redirect('/a-product/promotion-banner')
    })
})

router.get('/edit-promotion-banner/:id', verifyLogin , async (req,res) => {

    console.log(req.params.id , "get method from edit promotion banner router");
    let details = await adminCategoryHelpers.viewPromotion(req.params.id)
        let promotionBannerDetails = details.promotionBanner 
        res.render('admin/edit-promotion', {promotionBannerDetails , admin_partial : true})
    })

router.post('/edit-promotion-banner/:id' , async (req,res) => {
        await adminCategoryHelpers.editPromotion(req.params.id , req.body).then( (response) => {
            req.session.successMessage = response.successMessage

            const id = req.params.id 
            const img1 = req.files.image1
            const img2 = req.files.image2

            if (img1) {
                img1.mv('./public/promotion-images/' + id + '1.jpeg')
            }
            if (img2) {
                img2.mv('./public/promotion-images/' + id + '2.jpeg')
            }

            res.redirect('/a-product/promotion-banner')
        })
    })

    // admin banner management  last promotion

router.get('/last-promotion', verifyLogin , async (req,res) => {

    let details = await adminCategoryHelpers.findpromotionLast()
    let promotionBannerDetails = details.lastpromotionBanner 
    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    res.render('admin/last-promotion', {errorMessage , successMessage , admin_partial : true , promotionBannerDetails })
})

router.post('/last-promotion',async (req,res) => {
    await adminCategoryHelpers.addpromotionLast(req.body).then( (response) => {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage

        const id = response.lastpromotionBannerId

        const img1 = req.files.image1

        if (img1) {
            img1.mv('./public/last-promotion-images/' + id + '.jpeg')
        }
        

        res.redirect('/a-product/last-promotion')
    })
})

router.get('/delete-last-promotion-banner/:id', verifyLogin , async (req,res) => {
    await adminCategoryHelpers.deleteLastpromotionBanner(req.params.id).then( (response)=> {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage
        res.redirect('/a-product/last-promotion')
    })
})

router.get('/edit-last-promotion-banner/:id', verifyLogin , async (req,res) => {
    let details = await adminCategoryHelpers.viewLastPromotion(req.params.id)
        let promotionBannerDetails = details.lastpromotionBanner 
        res.render('admin/edit-last-promotion', {promotionBannerDetails , admin_partial : true})
    })

router.post('/edit-last-promotion-banner/:id' , async (req,res) => {
        await adminCategoryHelpers.editLastPromotion(req.params.id , req.body).then( (response) => {
            req.session.successMessage = response.successMessage

            const id = req.params.id 
            const img1 = req.files.image1

            console.log(id + "from edit");
            console.log(img1 + "from edit pic details");

            if (img1) {
                img1.mv('./public/last-promotion-images/' + id + '.jpeg')
            }

            res.redirect('/a-product/last-promotion')
        })
    })

    // admin banner management coupon

router.get('/coupon-banner', verifyLogin , async (req,res) => {

    let details = await adminCategoryHelpers.findCouponBanner()
    let couponBannerDetails = details.couponBanner 
    const errorMessage = req.session.errorMessage
    req.session.errorMessage = null
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    res.render('admin/coupon-banner', {errorMessage , successMessage , admin_partial : true , couponBannerDetails})
})

router.post('/coupon-banner', (req,res) => {
    adminCategoryHelpers.addCouponBanner(req.body).then( (response) => {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage
        res.redirect('/a-product/coupon-banner')
    })
})

router.get('/delete-coupon-banner/:id', verifyLogin , (req,res) => {
    console.log(req.params._id + "from delete");
    adminCategoryHelpers.deleteCouponBanner(req.params.id).then( (response) => {
        req.session.errorMessage = response.errorMessage
        req.session.successMessage = response.successMessage
        res.redirect('/a-product/coupon-banner')
    })
})

//view add delete subscription plans

router.get('/add-subscription-plans' ,verifyLogin, (req,res) => {
    
res.render('admin/add-subscription-plans' , {admin_partial : true})
})

router.post('/add-subscription-plans', (req,res) => {
    adminCategoryHelpers.addSubscriptionPlans(req.body).then( (response) => {
        req.session.successMessage = response.successMessage
    })
   
    res.redirect('/a-product/view-plans')
})

// view - subscrption plans

router.get('/view-plans' ,async (req,res) => {
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    const subscription_plans = await adminCategoryHelpers.findPlans()
    res.render('admin/view-plans', {subscription_plans , admin_partial : true,  successMessage})
})

// delete - subscription plans

router.get('/delete-plan/:id', async(req,res) => {
    console.log(req.params.id , "id from delete subscription router");
    await adminCategoryHelpers.deletePlan(req.params.id).then ( (response) => {
        req.session.successMessage = response.successMessage
    })
    res.redirect('/a-product/view-plans')
})

// category and sub-category  ---  sample page

router.get('/get-subcategory/:category', async(req,res) => {   
const category =  await adminCategoryHelpers.findSubCategory(req.params.category)
    res.json(category)
})

// add , delete , view coupons

router.get ('/coupon-view',verifyLogin,async (req,res) => {
    const successMessage = req.session.successMessage
    req.session.successMessage = null
    const coupon = await adminCategoryHelpers.findCoupon()
    const planTitle = req.session.planTitle
    req.session.planTitle = null
    for( x of coupon) {
        x.validity = moment (x.validity).format("ll")
      }

    res.render('admin/coupon-view' , {successMessage , planTitle , admin_partial : true , coupon})
})

router.get('/add-coupon' , verifyLogin , async(req,res) => {
    const plan =  await adminCategoryHelpers.findPlans()
    res.render('admin/add-coupon', {plan , admin_partial : true})
})

router.post('/add-coupon' , verifyLogin , async(req,res) => {
    
    await adminCategoryHelpers.addCoupon(req.body).then( (response) => {
        req.session.successMessage = response.successMessage
    })
    const plan_details = await adminCategoryHelpers.findOnePlan(req.body.plan)    
    req.session.planTitle = plan_details.planTitle

    res.redirect('/a-product/coupon-view')
})

router.get('/delete-coupon/:id' , verifyLogin , async(req,res) => {

    const msg = await adminCategoryHelpers.deleteOneCoupon(req.params.id)
    req.session.successMessage = msg.successMessage
    res.redirect('/a-product/coupon-view')
})

// disable enable user and plan

router.get('/user-view' , verifyLogin , async(req,res) => {
    const users = await adminCategoryHelpers.getAllUsers()
    res.render('admin/user-view', {users , admin_partial : true})
})

router.get('/user-view/block_plan/:id' , verifyLogin , async(req,res) => {
    await adminCategoryHelpers.disablePlan(req.params.id)
    res.redirect('/a-product/user-view')
})

router.get('/user-view/block_user/:id' , verifyLogin , async(req,res) => {
    await adminCategoryHelpers.disableUser(req.params.id)
    res.redirect('/a-product/user-view')
})

router.get('/user-view/unblock_plan/:id' , verifyLogin , async(req,res) => {
    await adminCategoryHelpers.enablePlan(req.params.id)
    res.redirect('/a-product/user-view')
})

router.get('/user-view/unblock_user/:id' , verifyLogin , async(req,res) => {
    await adminCategoryHelpers.enableUser(req.params.id)
    res.redirect('/a-product/user-view')
})

// disable enable order (order management)

router.get('/order-view' , verifyLogin , async(req,res) => {

    const orders = await adminCategoryHelpers.alluserOrderDetails()
    for( x of orders) {
        x.date = moment (x.date).format("ll")
      }

      const successMessage = req.session.successMessage
      req.session.successMessage = null
    res.render('admin/order-view', {orders , successMessage , admin_partial : true})
})

router.get('/cancelled-order/:id1/:id2' , verifyLogin , async (req,res) => {
    
    userId = req.params.id1
    orderId = req.params.id2
 
    const msg = await adminCategoryHelpers.cancelOrdrByAdmin(userId , orderId)
    req.session.successMessage = msg.successMessage
    res.redirect('/a-product/order-view')
  })

router.get('/packed-order/:id1/:id2' , verifyLogin , async (req,res) => {
    
    userId = req.params.id1
    orderId = req.params.id2

    console.log(id1 , id2 , "params uddddddddddd in packed");
 
    const msg = await adminCategoryHelpers.packedOrdrByAdmin(userId , orderId)
    req.session.successMessage = msg.successMessage
    res.redirect('/a-product/order-view')
  })

router.get('/shipped-order/:id1/:id2' , verifyLogin , async (req,res) => {
    
    userId = req.params.id1
    orderId = req.params.id2
 
    const msg = await adminCategoryHelpers.shippedOrdrByAdmin(userId , orderId)
    req.session.successMessage = msg.successMessage
    res.redirect('/a-product/order-view')
  })

router.get('/delivered-order/:id1/:id2' , verifyLogin , async (req,res) => {
    
    userId = req.params.id1
    orderId = req.params.id2
 
    const msg = await adminCategoryHelpers.deliveredOrdrByAdmin(userId , orderId)
    req.session.successMessage = msg.successMessage
    res.redirect('/a-product/order-view')
  })

//   manage stock view

router.get('/stock-view'  , async(req,res) => {
    const books =  await adminCategoryHelpers.getAllProduct()
    const book = books.book
    res.render('admin/stock-view', {book , admin_partial : true})
})

// date sort page

router.post('/stock-view' , verifyLogin , async(req,res) => {
        let from= req.body.startdate
        let to = req.body.enddate
        let allstockesreport=await adminCategoryHelpers.getdatestockesreport(from,to)
        for(x of allstockesreport){
          x.date=moment(x.date).format('ll')
        }
        res.render('admin/date-sort-stocks', {allstockesreport , admin_partial : true})
})

//   manage sale view

router.get('/sale-view' , verifyLogin , async(req,res) => {

    const books =  await adminCategoryHelpers.getAllProduct()
    const book = books.book
    const plans =  await adminCategoryHelpers.findAllPlans()    
    final =  await adminCategoryHelpers.findTotalAmountAndCount()

    res.render('admin/sale-view', { final ,admin_partial : true })
})

// date sort page

router.post('/sale-view' , verifyLogin , async(req,res) => {
        let from= req.body.startdate
        let to = req.body.enddate
        let allsalesreport=await adminCategoryHelpers.getdatesalesreport(from,to)
        for(x of allsalesreport){
          x.date=moment(x.date).format('ll')
        }
        res.render('admin/date-sort', {allsalesreport , admin_partial : true})
})

// overDue Users

router.get('/overDue' ,verifyLogin, async (req,res) => {

    const successMessage = req.session.successMessage 
    req.session.successMessage = null  

    let returnBook = await adminCategoryHelpers.findAllReturnBook()

 
    // console.log(dueDays , returnBook.date , returnBook.planEndDate , returnBook , "heeeeeeeeeeee");

    if (returnBook) {

        for( let x of returnBook) {
            x.date = moment (x.date).format("ll")
            x.planEndDate = moment (x.planEndDate).format("ll")
        }
        res.render('admin/overDue' , { returnBook , successMessage , admin_partial : true })
    }
    else {
    console.log(" return is null ");
}
    
})

router.get('/return-accept' ,verifyLogin, async (req,res) => { 

    const userId = req.query.userId
    const bookId = req.query.bookId
   
    await adminCategoryHelpers.deleteReturnBookFromOrder(userId , bookId)
    await adminCategoryHelpers.deleteReturnBookFromReturn(userId , bookId)
    await adminCategoryHelpers.reduceRentCoutAfterReturn( userId , bookId)
    .then( (response) => {
        req.session.successMessage = response.successMessage
    })

    res.redirect('/a-product/overDue')
})

router.get('/send-notification/:userId/:bookId/:fineAmount' ,verifyLogin, async (req,res) => { 

    const userId = req.params.userId
    const bookId = req.params.bookId
    const fineAmount = req.params.fineAmount


    await adminCategoryHelpers.updateReturnBooks(userId , bookId , fineAmount)


    res.redirect('/a-product/overDue')
})

// add fine amount

router.get('/add-fine' , verifyLogin , async ( req,res) => {
    const successMessage = req.session.successMessage 
    req.session.successMessage  = null
    res.render('admin/add-fine' , {successMessage , admin_partial : true})
})

router.post('/add-fineAmount-Premium' , verifyLogin , async ( req,res) => {

    await adminCategoryHelpers.updatePremiumFineInBook(req.body)
    .then ( (response) => {
        req.session.successMessage = response.successMessage
    })
    res.redirect('/a-product/add-fine')
})

router.post('/add-fineAmount-nonPremium' , verifyLogin , async ( req,res) => {
    
    await adminCategoryHelpers.updateNonPremiumFineInBook(req.body)
    .then ( (response) => {
        req.session.successMessage = response.successMessage
    })
    res.redirect('/a-product/add-fine')
})

// for earnigs overview table

router.get('/earnings_overview' ,verifyLogin, async (req,res) => { 

    let final =  await adminCategoryHelpers.findTotalAmountPerMonth()

    
    res.json(final)
})


// for piechart

router.get('/pieChart' ,verifyLogin, async (req,res) => { 

    let userDetails =  await adminCategoryHelpers.userDataUsingState()
    let userState = userDetails.userState
    let state = userDetails.state
    let countOfState = userDetails.countOfState
    let sumOfSubscription = userDetails.sumOfSubscription

    let totalCount = 0
    let totalSum = 0
    let countPercentage = []
    let subscriptionPercentage = []

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
    
    res.json({userState , state , countOfState , subscriptionPercentage , countPercentage ,sumOfSubscription})
})

// router.get('/abc' , async (req,res) => {
//     res.render('admin/errorPage')
// })








module.exports = router;