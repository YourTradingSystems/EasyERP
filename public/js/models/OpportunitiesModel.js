define([
    'common',
    'Validation'
],
function (common, Validation) {
    var OpportunityModel = Backbone.Model.extend({
        idAttribute: "_id",
        initialize: function () {
            this.on('invalid', function (model, errors) {
                if (errors.length > 0) {
                    var msg = errors.join('\n');
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
                response.convertedDate = common.utcDateToLocaleDate(response.convertedDate);
            }
            return response;
        },

        validate: function (attrs) {
            var errors = [];

            Validation.checkNameField(errors, true, attrs.name, "Subject");
            if (attrs.expectedClosing && attrs.nextAction)
                Validation.checkFirstDateIsGreater(errors, attrs.expectedClosing, "expected closing date", attrs.nextAction.date, "Next action date");
            Validation.checkMoneyField(errors, false, attrs.expectedRevenue.value, "Expected revenue");
            if (errors.length > 0)
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
            salesPerson: null,
            salesTeam: null,
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
