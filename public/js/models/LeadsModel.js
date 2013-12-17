define(['Validation'],function (Validation) {
    var LeadModel = Backbone.Model.extend({
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

            if(attrs.name === ""){
                errors.push(
                    {
                        name:"Leads",
                        field:"name",
                        msg:"Lead name can not be empty"
                    }
                );
            }
            if(attrs.name.length > 0){
                if(!Validation.validName(attrs.name)){
                    errors.push(
                        {
                            name: "Leads",
                            field: "name",
                            msg: "Lead name should contain only letters"
                        }
                    );
                }
            }
            if(attrs.contactName.first.length > 0){
                if(!Validation.validName(attrs.contactName.first)){
                    errors.push(
                        {
                            name: "Leads",
                            field: "name",
                            msg: "Contact first name should contain only letters"
                        }
                    );
                }
            }
            if(attrs.contactName.last.length > 0){
                if(!Validation.validName(attrs.contactName.last)){
                    errors.push(
                        {
                            name: "Leads",
                            field: "name",
                            msg: "Contact last should contain only letters"
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
            if(attrs.phones.fax.length > 0){
                if(!Validation.validPhone(attrs.phones.fax)){
                    errors.push(
                        {
                            name: "Person",
                            field: "fax",
                            msg: "Fax should contain only numbers"
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
                if(!Validation.validName(attrs.address.city)){
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
                if(!Validation.validName(attrs.address.state)){
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
                if(!Validation.validName(attrs.address.country)){
                    errors.push(
                        {
                            name: "Person",
                            field: "country",
                            msg: "Country field should contain only letters"
                        }
                    );
                }
            }
            if(attrs.internalNotes.length > 0){
                if(!Validation.validStreet(attrs.internalNotes)){
                    errors.push(
                        {
                            name: "Person",
                            field: "internalNotes",
                            msg: "Internal notes field should contain only letters"
                        }
                    );
                }
            }
            if(errors.length > 0)
                return errors;
        },
        defaults: {
            isOpportunitie: false,
            createCustomer: false,
            name: 'New Lead',
            company: {
                id: '',
                name: ''
            },
            customer: {
                id: '',
                name: ''
            },
            address: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            },
            salesPerson: {
                id: '',
                name: ''
            },
            salesTeam: {
                id: '',
                name: ''
            },
            contactName: {
                first: '',
                last: ''
            },
            email: '',
            func: '',
            phones: {
                mobile: '',
                phone: '',
                fax: ''
            },

            priority: 'Trivial',
            categories: {
                id: '',
                name: ''
            },
            internalNotes: '',
            active: true,
            optout: false,
            reffered: '',
            workflow: {
                wName: 'lead',
                name: 'New',
                status: 'New'
            }
        },

        urlRoot: function () {
            return "/Leads";
        }
    });

    return LeadModel;
});
