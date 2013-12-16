define([
    'common',
    'Validation'
],
function (common, Validation) {
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

            if($.trim(attrs.nextAction.date).length > 0){
                if(!Validation.validDate(attrs.nextAction.date)){
                    errors.push(
                        {
                            name: "Opportunities",
                            field: "nextAction",
                            msg: "Next action date is not a valid date"
                        }
                    );
                } else{
                    if(new Date(attrs.nextAction.date) > new Date(attrs.expectedClosing)){
                        errors.push(
                            {
                                name: "Opportunities",
                                field: "expectedClosing",
                                msg: "Next action date can not be greater than expected closing date"
                            }
                        );
                    }
                }
            }
            if($.trim(attrs.expectedClosing).length > 0){
                if(!Validation.validDate(attrs.expectedClosing)){
                    errors.push(
                        {
                            name: "Opportunities",
                            field: "expectedClosing",
                            msg: "Expected closing date is not a valid date"
                        }
                    );
                }
            }

            if($.trim(attrs.name) == ""){
                errors.push(
                    {
                        name: "Opportunities",
                        field: "subject",
                        msg: "Opportunity subject can not be empty"
                    }
                );
            }
            if(!Validation.validMoneyAmount(attrs.expectedRevenue.value)){
                errors.push(
                    {
                        name: "Opportunities",
                        field: "expectedRevenue",
                        msg: "Expected revenue can contain only numbers dot separated with max 2 digits after dot"
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
                value: 0.0,
                currency: $,
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
