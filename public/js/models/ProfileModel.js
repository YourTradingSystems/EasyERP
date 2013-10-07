define( function () {
    var ProfileModel = Backbone.Model.extend({
        idAttribute:"_id",
        defaults:{
            profileName: '',
            profileDescription: ''
        },
        urlRoot: function(){
             return "/Profiles";
        }
    });

    return ProfileModel;
});