define(function () {
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

            if($.trim(attrs.name) == ""){
                errors.push(
                    {
                        name:"Leads",
                        field:"name",
                        msg:"Lead name can not be empty"
                    }
                );
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
