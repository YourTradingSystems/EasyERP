define(["Validation"],function (Validation) {
    var CompanyModel = Backbone.Model.extend({
        idAttribute: "_id",
		initialize: function(){
            this.on('invalid', function(model, errors){
                if(errors.length > 0){
                    var msg = $.map(errors,function(error){
                        return error.msg;
                    }).join('\n');
                    alert(msg);
                }
            });
        },

        validate: function(attrs){
            var errors = [];

            if(attrs.name.first === ""){
                errors.push(
                    {
                        name: "Company",
                        field: "name",
                        msg: "Company name can not be empty"
                    }
                );
            }
            if(attrs.name.first.length > 0){
                if(!Validation.validName(attrs.name.first)){
                    errors.push(
                        {
                            name: "Company",
                            field: "name",
                            msg: "Company name should contain only letters"
                        }
                    );
                }
            }
            if(attrs.phones.phone.length > 0){
                if(!Validation.validPhone(attrs.phones.phone)){
                    errors.push(
                        {
                            name: "Person",
                            field: "phone",
                            msg: "Phone should contain only numbers"
                        }
                    );
                }
            }
            if(attrs.phones.mobile.length > 0){
                if(!Validation.validPhone(attrs.phones.mobile)){
                    errors.push(
                        {
                            name: "Person",
                            field: "mobile",
                            msg: "Mobile phone should contain only numbers"
                        }
                    );
                }
            }
            if(attrs.address.street.length > 0){
                if(!Validation.validStreet(attrs.address.street)){
                    errors.push(
                        {
                            name: "Person",
                            field: "street",
                            msg: "Street field should contain only letters, numbers and signs: . , - /"
                        }
                    );
                }
            }
            if(attrs.address.city.length > 0){
                if(!Validation.validStreet(attrs.address.city)){
                    errors.push(
                        {
                            name: "Person",
                            field: "city",
                            msg: "City field should contain only letters"
                        }
                    );
                }
            }
            if(attrs.address.state.length > 0){
                if(!Validation.validStreet(attrs.address.state)){
                    errors.push(
                        {
                            name: "Person",
                            field: "state",
                            msg: "State field should contain only letters"
                        }
                    );
                }
            }
            if(attrs.address.zip.length > 0){
                if(!Validation.validNumber(attrs.address.zip)){
                    errors.push(
                        {
                            name: "Person",
                            field: "zip",
                            msg: "Zip field should contain only numbers"
                        }
                    );
                }
            }
            if(attrs.address.country.length > 0){
                if(!Validation.validStreet(attrs.address.country)){
                    errors.push(
                        {
                            name: "Person",
                            field: "country",
                            msg: "Country field should contain only letters"
                        }
                    );
                }
            }
            if(errors.length > 0)
                return errors;

        },
        defaults: {
            imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
            isOwn: false,
            type: 'Company',
            email: '',
            name: {
                first: '',
                last: ''
            },
            address: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            },
            website: '',
            contacts: [],
            phones: {
                phone: null,
                mobile: null,
                fax: null
            },
            internalNotes: '',
            salesPurchases: {
                isCustomer: false,
                isSupplier: false,
                salesPerson: null,
                salesTeam: null,
                active: true,
                reference: '',
                language: 'English',
                date: null
            },
            social: {
                fb: '',
                li: ''
            },
            history: [],
            attachments:[],
            notes:[]
        },

        urlRoot: function () {
            return "/Companies";
        }
    });

    return CompanyModel;
});