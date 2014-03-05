define([
    'text!templates/Notes/NoteTemplate.html'

], function (NoteTemplate) {
    var NoteView = Backbone.View.extend({

        initialize: function() {
        },
        events: {
            "click #noteArea" : "expandNote",
            "click #cancelNote" : "cancelNote",
            "click #addNote" : "saveNote",
            "click .addTitle" : "showTitle",
            "click .editNote" : "editNote"
        },

		editNote : function(e){
			$(".title-wrapper").show();
			$("#noteArea").attr("placeholder","").parents(".addNote").addClass("active");
		},
        
		expandNote : function(e){
			if (!$(e.target).parents(".addNote").hasClass("active")){
				$(e.target).attr("placeholder","").parents(".addNote").addClass("active");
				$(".addTitle").show();
			}
		},
        
		cancelNote : function(e){
			$(e.target).parents(".addNote").find("#noteArea").attr("placeholder","Add a Note...").parents(".addNote").removeClass("active");
			$(e.target).parents(".addNote").find("#noteArea").val("");
			$('#getNoteKey').val('');// remove id from hidden field if note editing is cancel
			$(".title-wrapper").hide();
			$(".addTitle").hide();
        },

		saveNote : function(e){
			if ($(e.target).parents(".addNote").find("#noteArea").val().replace(/ /g,'') || $(e.target).parents(".addNote").find("#noteTitleArea").val().replace(/ /g,'')){
				$(e.target).parents(".addNote").find("#noteArea").attr("placeholder","Add a Note...").parents(".addNote").removeClass("active");
				$(".title-wrapper").hide();
				$(".addTitle").hide();
			}
			else{
				$(e.target).parents(".addNote").find("#noteArea").focus();
			}
        },

		 showTitle : function(e){
			$(e.target).hide().parents(".addNote").find(".title-wrapper").show().find("input").focus();
        },

        template: _.template(NoteTemplate),

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    return NoteView;
});
