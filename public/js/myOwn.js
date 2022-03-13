// const { response } = require("express");

// const Response = require("twilio/lib/http/response");

// const { x } = require("pdfkit");
// const doc = require("pdfkit");

// const { Code } = require("mongodb");









function viewImage() {
    document.getElementById('imgView').src = URL.createObjectURL(event.target.files[0])
}

function validateEditForm () {

console.log("FUNCTION CALLED");

let x = document.forms["productEdit"]["book_name"].value;

if (x == "") {
    alert("Book name must be filled out")
    return false;
}
}

// resend otp

$(".btn_resend").on("click", () => {
    $.ajax({
        url : "/u-otp/resendOtp" ,
        type : "post" ,
        dataType : "json" ,
        success : function (res) {
            if (res) {
                countDownTimer()
                $('.btn_resend').hide()
                $('.btn_verify').show()
            }
            else {
                alert("otp sending failed")
            }
        }
    })
})

var seconds = 120;

function countDownTimer(){
    var countDownDate = new Date();
    countDownDate.setSeconds( countDownDate.getSeconds() + seconds );

    var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result in the element with id="demo"
        $("#demo").html(minutes + "m " + seconds + "s ");
        
        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(x);
            $("#demo").html("EXPIRED");
            $('.btn_resend').show()
                $('.btn_verify').hide()
        }
    }, 1000);
}

$( document ).ready(function() {
    countDownTimer();
});

// number loop used in  product view


const td = document.querySelectorAll(".index")

for ( i = 0 ; i < td.length ; i++ ) {
    td[i].innerHTML = i + 1
}


// add to wishlist

function addToWishlist(proId) {
    $.ajax({
        url : '/add-to-wishlist/'+ proId ,
        method :'get' ,
        success : (response)=> {
            if(response.status){

                let count =$('#wishlist-count').html()
                count = parseInt(count) + 1
                $("#wishlist-count").html(count)

                // let shiprate = $('#ship-rate').html()

                // let total =$('#total-rate').html()
                // total = response.shiprate * response.cartCount
                // $('#total-rate').html(total) wishlist
            }
         
        }
    })
}

// for delete wishlist

function deleteWishlist(event , proId , bookName) {
    event.preventDefault();

    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete" +bookName +'?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async(result) => {
        console.log(result);
            if (result.isConfirmed) {
                let response = await fetch("/delete-wishlist-product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    proId: proId
    
                })
            })
            location.reload()
            }
            else {
                return false
            }
    })
    
}

// for add to cart

function addToCart(proId) {
    $.ajax({
        url : '/add-to-cart/'+ proId ,
        method :'get' ,
        success : (response)=> {
            if(response.status){

                let countt =$('#cart-count').html()

                let count = parseInt (countt)

                count = count + 1
            
                $("#cart-count").html(count)

                // let shiprate = $('#ship-rate').html()

                let total =$('#total-rate').html()
                total = response.shiprate * response.cartCount
                $('#total-rate').html(total)
            }
         
        }
    })
}

// for delete cart

function deleteCart(event , proId , bookName) {
    event.preventDefault();

    Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to delete" +bookName +'?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(async(result) => {
        console.log(result);
            if (result.isConfirmed) {
                let response = await fetch("/delete-cart-product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    proId: proId
    
                })
            })
            location.reload()
            }
            else {
                return false
            }
    })
    
}

// for new data table

$(document).ready(function() {
    var table = $('#example').DataTable({
        searchPanes: true
    });
    table.searchPanes.container().prependTo(table.table().container());
    table.searchPanes.resizePanes();
});

// for state and district

var AndraPradesh = ["Anantapur","Chittoor","East Godavari","Guntur","Kadapa","Krishna","Kurnool","Prakasam","Nellore","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari"];
var ArunachalPradesh = ["Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kra Daadi","Kurung Kumey","Lohit","Longding","Lower Dibang Valley","Lower Subansiri","Namsai","Papum Pare","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang","Itanagar"];
var Assam = ["Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup Metropolitan","Kamrup (Rural)","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Dima Hasao","Sivasagar","Sonitpur","South Salmara Mankachar","Tinsukia","Udalguri","West Karbi Anglong"];
var Bihar = ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"];
var Chhattisgarh = ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Janjgir Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sukma","Surajpur","Surguja"];
var Goa = ["North Goa","South Goa"];
var Gujarat = ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"];
var Haryana = ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Mewat","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"];
var HimachalPradesh = ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul Spiti","Mandi","Shimla","Sirmaur","Solan","Una"];
var JammuKashmir = ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kargil","Kathua","Kishtwar","Kulgam","Kupwara","Leh","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"];
var Jharkhand = ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum"];
var Karnataka = ["Bagalkot","Bangalore Rural","Bangalore Urban","Belgaum","Bellary","Bidar","Vijayapura","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Gulbarga","Hassan","Haveri","Kodagu","Kolar","Koppal","Mandya","Mysore","Raichur","Ramanagara","Shimoga","Tumkur","Udupi","Uttara Kannada","Yadgir"];
var Kerala = ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"];
var MadhyaPradesh = ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna",
"Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"];
var Maharashtra = ["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"];
var Manipur = ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"];
var Meghalaya = ["East Garo Hills","East Jaintia Hills","East Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"];
var Mizoram = ["Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip","Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip"];
var Nagaland = ["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Peren","Phek","Tuensang","Wokha","Zunheboto"];
var Odisha = ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Debagarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundergarh"];
var Punjab = ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Firozpur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Mohali","Muktsar","Pathankot","Patiala","Rupnagar","Sangrur","Shaheed Bhagat Singh Nagar","Tarn Taran"];
var Rajasthan = ["Ajmer","Alwar","Banswara","Baran","Barmer","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Dholpur","Dungarpur","Ganganagar","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Kota","Nagaur","Pali","Pratapgarh","Rajsamand","Sawai Madhopur","Sikar","Sirohi","Tonk","Udaipur"];
var Sikkim = ["East Sikkim","North Sikkim","South Sikkim","West Sikkim"];
var TamilNadu = ["Ariyalur","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Salem","Sivaganga","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"];
var Telangana = ["Adilabad","Bhadradri Kothagudem","Hyderabad","Jagtial","Jangaon","Jayashankar","Jogulamba","Kamareddy","Karimnagar","Khammam","Komaram Bheem","Mahabubabad","Mahbubnagar","Mancherial","Medak","Medchal","Nagarkurnool","Nalgonda","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Ranga Reddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal Rural","Warangal Urban","Yadadri Bhuvanagiri"];
var Tripura = ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"];
var UttarPradesh = ["Agra","Aligarh","Allahabad","Ambedkar Nagar","Amethi","Amroha","Auraiya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Faizabad","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri","Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"];
var Uttarakhand  = ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri","Pithoragarh","Rudraprayag","Tehri","Udham Singh Nagar","Uttarkashi"];
var WestBengal = ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"];
var AndamanNicobar = ["Nicobar","North Middle Andaman","South Andaman"];
var Chandigarh = ["Chandigarh"];
var DadraHaveli = ["Dadra Nagar Haveli"];
var DamanDiu = ["Daman","Diu"];
var Delhi = ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"];
var Lakshadweep = ["Lakshadweep"];
var Puducherry = ["Karaikal","Mahe","Puducherry","Yanam"];


$("#inputState").change(function(){
    var StateSelected = $(this).val();
    console.log(StateSelected);
  var optionsList;
  var htmlString = "";

  switch (StateSelected) {
    case "Andra Pradesh":
        optionsList = AndraPradesh;
        break;
    case "Arunachal Pradesh":
        optionsList = ArunachalPradesh;
        break;
    case "Assam":
        optionsList = Assam;
        break;
    case "Bihar":
        optionsList = Bihar;
        break;
    case "Chhattisgarh":
        optionsList = Chhattisgarh;
        break;
    case "Goa":
        optionsList = Goa;
        break;
    case  "Gujarat":
        optionsList = Gujarat;
        break;
    case "Haryana":
        optionsList = Haryana;
        break;
    case "Himachal Pradesh":
        optionsList = HimachalPradesh;
        break;
    case "Jammu and Kashmir":
        optionsList = JammuKashmir;
        break;
    case "Jharkhand":
        optionsList = Jharkhand;
        break;
    case  "Karnataka":
        optionsList = Karnataka;
        break;
    case "Kerala":
        optionsList = Kerala;
        break;
    case  "Madya Pradesh":
        optionsList = MadhyaPradesh;
        break;
    case "Maharashtra":
        optionsList = Maharashtra;
        break;
    case  "Manipur":
        optionsList = Manipur;
        break;
    case "Meghalaya":
        optionsList = Meghalaya ;
        break;
    case  "Mizoram":
        optionsList = Mizoram;
        break;
    case "Nagaland":
        optionsList = Nagaland;
        break;
    case  "Orissa":
        optionsList = Orissa;
        break;
    case "Punjab":
        optionsList = Punjab;
        break;
    case  "Rajasthan":
        optionsList = Rajasthan;
        break;
    case "Sikkim":
        optionsList = Sikkim;
        break;
    case  "Tamil Nadu":
        optionsList = TamilNadu;
        break;
    case  "Telangana":
        optionsList = Telangana;
        break;
    case "Tripura":
        optionsList = Tripura ;
        break;
    case  "Uttaranchal":
        optionsList = Uttaranchal;
        break;
    case  "Uttar Pradesh":
        optionsList = UttarPradesh;
        break;
    case "West Bengal":
        optionsList = WestBengal;
        break;
    case  "Andaman and Nicobar Islands":
        optionsList = AndamanNicobar;
        break;
    case "Chandigarh":
        optionsList = Chandigarh;
        break;
    case  "Dadar and Nagar Haveli":
        optionsList = DadraHaveli;
        break;
    case "Daman and Diu":
        optionsList = DamanDiu;
        break;
    case  "Delhi":
        optionsList = Delhi;
        break;
    case "Lakshadeep":
        optionsList = Lakshadeep ;
        break;
    case  "Pondicherry":
        optionsList = Pondicherry;
        break;
}


  for(var i = 0; i < optionsList.length; i++){
    htmlString = htmlString+"<option value='"+ optionsList[i] +"'>"+ optionsList[i] +"</option>";
  }
  $("#inputDistrict").html(htmlString);

});

// for checkout and payment


(async function() {$("#checkOut-form").submit( (e) => {

    
    e.preventDefault() 
    $.ajax({
        url : '/checkout' ,
        method : 'post' ,
        data : $('#checkOut-form').serialize(),
        success : async (response) => {
  
            if (response.COD_Success) {
                location.href='/place-order'
            }
            else if (response.payPal_success) {
                location.href = '/payPal'
            }
            else{
                
                razorPayPayment(response)
                
            }
        }

    })

})
})
()


function razorPayPayment (order) {


    
    var options = {
        "key": "rzp_test_4s8ud71AFs83mi", // Enter the Key ID generated from the Dashboard
        "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "BookLeaves",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
           


            verifyPayment(response,order)
       
            
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    
    var rzp1 = new Razorpay(options);
    rzp1.open();
}


function verifyPayment(payment,order) {

    
   
    $.ajax ({
        url : '/verify-payment',
        data : {
            payment,
            order
        },
        method : 'post' ,
        success : (response) => {
            console.log("from razor Payment");
            if (response.status) {
                location.href='/place-order'
                
            }
            else {
                alert ("Payment Failed")
            }
        }
    })
}







    $(document).ready(function(){
      var date_input=$('input[name="date"]'); //our date input has the name "date"
      var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
      var options={
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
      };
      date_input.datepicker(options);
    })

            //   category and sub-category

            async function getSubCatogory(category) {
                document.getElementById("subcategorys").innerHTML = "<option></option>";
                const response = await fetch("http://localhost:3000/a-product/get-subcategory/"+category)
                let subcategory = await response.json()
                    for (x of subcategory) {
                        document.getElementById("subcategorys").innerHTML += "<option>" + x + "</option>";
                    }
            }

    // for category and sub category menu

    function makeSubCategory(value) {


        
        if (value.length == 0) document.getElementById("subcategorys").innerHTML = "<option></option>";
        else {
            var tempValue = "";
            for (x in subcategory[value]) {
                tempValue += "<option>" + subcategory[value][x] + "</option>";
            }
            document.getElementById("subcategorys").innerHTML = tempValue;
        }
    }

    function displaySelected() {
        var country = document.getElementById("categorys").value;
        var city = document.getElementById("subcategorys").value;

    }

    function resetSelection() {
        document.getElementById("categorys").selectedIndex = 0;
        document.getElementById("subcategorys").selectedIndex = 0;
    }

    // validation including image for edit product

    // let book_description = document.getElementById("book_description").innerHTML
    // console.log(book_description);
    // document.getElementById("descriptionEdit").value = book_description

    function validationaddress() {
        let book_description = document.getElementById("book_description").innerHTML
        document.getElementById("descriptionEdit").value = book_description
    
      }

          // validation including image for add product

          

          function validationAddProduct() {
              
            let bookName = document.getElementById("bookName").value
            let book_number = document.getElementById("book_number").value
            let file1 = document.getElementById("file1").value
            let file2 = document.getElementById("file2").value
            let file3 = document.getElementById("file3").value
            let file4 = document.getElementById("file4").value

            if(bookName == "") {
                document.getElementById("bookNamError").innerHTML =
                "Please Enter A Book Name"
                return false
            } 

            if(book_number == "") {
                document.getElementById("bookNumError").innerHTML =
                "Please Enter The Count Of Book"
                return false
            } 

            if(file1 == "") {             
                document.getElementById("bookPicError1").innerHTML =
                "Please Choose A Image File To Insert"
            return false
                    }
                    if(file2 == "") {
                        document.getElementById("bookPicError2").innerHTML =
                "Please Choose A Image File To Insert"
                    return false
                            }
                            if(file3 == "") {
                                document.getElementById("bookPicError3").innerHTML =
                "Please Choose A Image File To Insert"
                            return false
                                    }
                                    if(file4 == "") {
                                        document.getElementById("bookPicError4").innerHTML =
                "Please Choose A Image File To Insert"
                                    return false
                                            }          
            
          }



// for checkout and payment for subscription


// (async function() {$("#btn_checkoutPlan").submit( (e) => {

    
//     e.preventDefault() 
//     $.ajax({
//         url : '/checkout-subscription' ,
//         method : 'post' ,
//         data : $('#btn_checkoutPlan').serialize(),
//         success : async (response) => {

//             if (response.payPal_success) {
//                 alert("paypal")
//                 location.href = '/payPal'
//             }
//             else{
//                 alert("razorPay")
                
//                 razorPayPaymentForSubscription(response)
                
//             }
//         }

//     })

// })
// })
// ()



$('#btn_checkoutPlan').on('submit' , (e) => {

    $.ajax({ 
        url : '/checkout-subscription' ,
        method : 'post' ,
        data : $('#btn_checkoutPlan').serialize(),
        success : (response) => {
            if (response.status) {               
                razorPayPaymentForSubscription(response)   
            }
            else{
                location.href = '/payPal'              
            }
        }
        
    })
    e.preventDefault();
})



function razorPayPaymentForSubscription (order) {
   

    var options = {
        
        "key": "rzp_test_4s8ud71AFs83mi", // Enter the Key ID generated from the Dashboard
        "amount": order.amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "BookLeaves",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){

        verifyPaymentSubscription(response,order)  
            
            
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
   

    var rzp1 = new Razorpay(options);
    rzp1.open();
}
    
function verifyPaymentSubscription(payment , order) {

    $.ajax ({
        url : '/verify-payment-subsciption',
        data : {
            payment,
            order
        },
        method : 'post' ,
        success : (response) => {
            if (response.status) {
                location.href='/place-order-subscription'
                
            }
            else {
                alert ("Payment Failed")
            }
        }
    })

}

// for coppy & paste

function myFunction() {
    var copyText = document.getElementById("myInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    
    var toool = document.getElementById("mytoool");
    toool.innerHTML = "Copied: " + copyText.value;
  }
  
  function outFunc() {
    var toool = document.getElementById("mytoool");
    toool.innerHTML = "Copy to clipboard";
  }

//   for coupon code    


function couponCode() {
  
    let ableDisable = document.getElementById("ableDisable")
    let givenCode = document.getElementById("codeCoupon").value
    let givenRate = document.getElementById("rate").value
    let newGivenRate = parseFloat(givenRate) 
    let finalRate = document.getElementById("finalRate")

    
    
        $.ajax ({
            url : '/gettingCoupon',
            data : {
                givenCode,
                newGivenRate
            },
            method : 'post' ,
            success : (response) => {
                
                // if (response)
                

                if (response.status) {

                if (response.coupon == response.code) {
                    document.getElementById("amount").innerHTML = "You Have Already Used This Coupon"
                   ableDisable.style.display = "block"
                   document.getElementById("total_head").style.color = "red";
                }
                else {
                    
                    if (response.code == givenCode) {                 

                        document.getElementById("amount").innerHTML = response.discountedRate + "!!!"
                        ableDisable.style.display = "block"
                        document.getElementById("total_head").style.color = "red";
                        document.getElementById("finalRate").innerHTML = response.finalAmount 
                        
                     }
                     else{
                         alert("faild")
                     }

                }
            }
            else {

                document.getElementById("amount").innerHTML = "You Entered Invalid Coupon Code"
                   ableDisable.style.display = "block"
                   document.getElementById("total_head").style.color = "red";
                   document.getElementById("finalRate").innerHTML = response.newGivenRate 

            }

                
            }
        })

    }

  
    // for data table using order view and user view in admin side

    document.addEventListener('DOMContentLoaded', function () {
let table = new DataTable('#example');
});

// for table product view (searching and sorting)


$(document).ready(function(){
    $('#myTable').dataTable();
});


// finding rental count

const total = parseInt (document.getElementById("totalCount").innerHTML)
const rentCount = document.getElementById("rentCount").innerHTML
const currentCount = total - rentCount
document.getElementById("currentCount").innerHTML = currentCount


// for download pdf && excel


function print() { 
    var element = document.getElementById('tblData');
    var opt = {
      margin: 1,
      filename: 'Sales-report.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'b4', orientation: 'landscape' }
    };
    var worker = html2pdf().set(opt).from(element).save();

  }


function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    filename = filename?filename+'.xls':'excel_data.xls'; 
    downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink); 
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{   
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;   
        downloadLink.download = filename;    
          downloadLink.click();
    }
}



// starting and ending date for table

$(function () {
    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10)
        month = '0' + month.toString();
    if (day < 10)
        day = '0' + day.toString();
    var maxDate = year + '-' + month + '-' + day;
    $('#startdate').attr('max', maxDate);
});



  $(function () {
    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    if (month < 10)
        month = '0' + month.toString();
    if (day < 10)
        day = '0' + day.toString();

    var maxDate = year + '-' + month + '-' + day;


    $('#enddate').attr('max', maxDate);
})
 
// radio button validation

// function radioValidation () {

//     let radioButtons = document.querySelectorAll('input[name="subscription_rate"]');
    // let monthRadio = document.getElementById("monthly")
    // let yearRadio = document.getElementById("yearly")

//     if(document.getElementById('monthly').checked == true) { 
//         alert("its month")  
//         return true   
// } else if (document.getElementById('yearly').checked == true) {
//     alert("its year")
//     return true
    
// } else {  
//     alert("its false")
//         return false   
// }

    

    // if (monthRadio.checked || yearRadio.checked) {
    //     alert("inside if case")
    //     return true
    // }
    // else {
    //     alert("inside else case")

    //     for (const r of radioButtons) {    
    //         if (r.checked) {
    //             return true
    //         }else {
    //             document.getElementById("error").innerHTML = "Please Choose Any One Of Plan Before You Submit"
    //             return false
    //         }
    //     }


    // }

    
// }


// cart message 

async function rentExceed() {
    
    const response = await fetch( "/checkout-fetch")
    let newResponse = await response.json()
    if ( newResponse.maxCount > newResponse.trueCount || newResponse.maxCount == newResponse.trueCount ) {
        window.location ='/checkout'
    }
    else {
var x = document.getElementById("snackbar");
x.className = "show";
setTimeout(function(){ x.className = x.className.replace("show", ""); }, 10000);
    }
    
}

(async function (){

    const response = await fetch( "/checkout-fetch")
    let newResponse = await response.json()
    console.log(newResponse);
    if ( newResponse.maxCount > newResponse.trueCount || newResponse.maxCount == newResponse.trueCount ) {
        window.location ='/checkout'
    }
    else {

var x = document.getElementById("snackbar");
x.className = "show";
setTimeout(function(){ x.className = x.className.replace("show", ""); }, 10000);
    }
})();

// for login

$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});




          