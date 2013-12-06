define(function () {
    var JobPositionsModel = Backbone.Model.extend({
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
                        name:"Job Position",
                        field:"name",
                        msg:"Job Position name can not be empty"
                    }
                );
            }
            if(errors.length > 0)
                return errors;
        },

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

    return JobPositionsModel;
});
