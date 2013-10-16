define( function () {
    var PersonModel = Backbone.Model.extend({
        idAttribute:"_id",

        defaults:{
            id: null,
            photoUrl: null,
            name: {
                first:"",
                last:""
            },
            email:"",
            address:{
                street1:"",
                street2:"",
                city:"",
                zip:"",
                country:"",
                state:""
            },
            website:"",
            jobPosition:"",
            phones:{
                phone:"",
                mobile:"",
                fax:""
            },
            salesPurchases:{
                isCustomer:false,
                isSupplier:false,
                active:false
            },
            color: '#4d5a75',
        },

        urlRoot: function(){
             return "/Persons";
        }
    });

    return PersonModel;
});