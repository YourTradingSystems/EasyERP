define(function () {
    var JobPositionModel = Backbone.Model.extend({
        idAttribute: "_id",
        defaults: {
            name: "New Job Position",
            expectedRecruitment: 0,
            interviewForm: {
                id: "",
                name: ""
            },
            department: {
                id: "",
                name: ""
            },
            description: "",
            requirements: "",
            workflow: {
                wName: 'jobposition',
                name: 'No Recruitment',
                status: 'New' 
            }
        },

        urlRoot: function () {
            return "/JobPosition";
        }
    });

    return JobPositionModel;
});