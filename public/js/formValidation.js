function validateForm(){
    var valid = $("#userform").validate({
        rules:{
            user_name:{
                required: true,
                maxlength: 30,
                minlength:3,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            user_email:{
                required: true,
                email: true,
                minlength: 5,
                maxlength: 35,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            user_state:{
                required: true,
                maxlength: 30,
                minlength:3,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            user_number:{
                required: true,
                maxlength: 10,
                minlength: 10,
                number: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            user_password:{
                required: true,
                minlength: 5,
                maxlength: 35,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            user_confirmpassword: {
                required: true,
                minlength: 5,
                maxlength: 35,
                normalizer: function(value) {
                    return $.trim(value);
                },
                equalTo: "#exampleInputPassword"
            }
        }
    })
    return valid;
}


function validateEditUserForm(){
    var valid = $("#edituserform").validate({
        rules:{
            name:{
                required: true,
                maxlength: 30,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            email:{
                required: true,
                email: true,
                minlength: 5,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
        }
    })
    return valid;
}

function validateOtpForm(){
    var valid = $("#otpform").validate({
        rules:{
            user_number:{
                required: true,
                maxlength: 10,
                minlength: 10,
                number: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
        }
    })
    return valid;
}

function validateEditAdminForm(){
    var valid = $("#editadminform").validate({
        rules:{
            admin_password:{
                required: true,
                maxlength: 30,
                minlength:5,
                number: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            admin_email:{
                required: true,
                email: true,
                minlength: 5,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
        }
    })
    return valid;
}

function validateOtpNumberForm(){
    var valid = $("#otpnumberform").validate({
        rules:{
            user_otp:{
                required: true,
                maxlength: 6,
                minlength: 6,
                number: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
        }
    })
    return valid;
}

function validateOtpAdminForm(){
    var valid = $("#otpadminform").validate({
        rules:{
            admin_number:{
                required: true,
                maxlength: 10,
                minlength: 10,
                number: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
        }
    })
    return valid;
}


function validateAdminCategory(){
    var valid = $("#admincategory").validate({
        rules:{
            admin_category:{
                required: true,
                maxlength: 12,
                minlength: 4,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
        }
    })
    return valid;
}

function validateForm1(){
    var valid = $("#productAdd").validate({
        rules:{
            book_name:{
                required: true,
                maxlength: 30,
                minlength:3,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            book_category:{
                required: true,
                lettersonly: true,
                minlength: 3,
                maxlength: 35,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            book_sub_category:{
                required: true,
                maxlength: 30,
                minlength:3,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            book_description:{
                required: true,
                maxlength: 30,
                minlength:3,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            
        }
    })
    return valid;
}

function validateForm2(){
    var valid = $("#editProduct").validate({
        rules:{
            book_name:{
                required: true,
                maxlength: 30,
                minlength:3,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            book_category:{
                required: true,
                lettersonly: true,
                minlength: 3,
                maxlength: 35,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            book_sub_category:{
                required: true,
                maxlength: 30,
                minlength:3,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            book_description:{
                required: true,
                maxlength: 30,
                minlength:3,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            
        }
    })
    return valid;
}



// jQuery.validator.addMethod("lettersonly", function(value, element) {
//     return this.optional(element) || /^[a-z," "]+$/i.test(value);
// }, "Only letters and spaces are allowed");


$(document).ready(function(){
    validateForm();
    validateEditUserForm()
    validateOtpForm()
    validateEditAdminForm()
    validateOtpNumberForm()
    validateOtpAdminForm()
    validateAdminCategory()
    // addProduct()
    // productEdit()
})