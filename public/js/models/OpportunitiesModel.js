define([
    'common'
],
function (common) {
    var OpportunityModel = Backbone.Model.extend({
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

        parse: true,

        parse: function (response) {
	           if (response && response.nextAction) {
	            	response.creationDate = common.utcDateToLocaleDate(response.creationDate);
	            	response.expectedClosing = common.utcDateToLocaleDate(response.expectedClosing);
	            	response.nextAction.date = common.utcDateToLocaleDate(response.nextAction.date);
	           }
	           return response;
        },

        validate: function(attrs){
            var errors = [];

            if($.trim(attrs.name) == ""){
                errors.push(
                    {
                        name:"Opportunities",
                        field:"subject",
                        msg:"Opportunities subject can not be empty"
                    }
                );
            }
            if(errors.length > 0)
                return errors;
        },

        defaults: {
            isOpportunitie: true,
            name: '',
            expectedRevenue: {
                value: '',
                currency: '',
                progress: ''
            },
            company: {
                id: '',
                name: ''
            },
            contactName: {
                first: '',
                last: ''
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
            email: '',
            phones: {
                mobile: '',
                phone: '',
                fax: ''
            },
           
            func: '',
            salesPerson: {
                id: '',
                name: ''
            },
            salesTeam: {
                id: '',
                name: ''
            },
            internalNotes: '',
            nextAction: {
                date: null,
                desc: ''
            },
            expectedClosing: null,
            priority: 'Trivial',
            categories: '',
            active: true,
            optout: false,
            reffered: '',
            workflow: ''
        },

        urlRoot: function () {
            return "/Opportunities";
        }
    });

    return OpportunityModel;
});
