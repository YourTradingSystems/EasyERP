define([
    'text!templates/Persons/list/ListTemplate.html',
    'text!templates/Persons/form/FormTemplate.html',
    'collections/Opportunities/OpportunitiesCollection',
    'views/Persons/thumbnails/ThumbnailsItemView',
    'views/Opportunities/compactContent',
    'custom',
    'common',
    'views/Persons/EditView',
    'views/Notes/NoteView',
    'text!templates/Notes/AddNote.html'

], function (ListTemplate, FormTemplate, OpportunitiesCollection, ThumbnailsItemView, opportunitiesCompactContentView, Custom, common, EditView ,noteView,addNoteTemplate) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Persons View');
            this.collection = options.collection;
            this.collection.bind('reset', _.bind(this.render, this));
            this.opportunitiesCollection = new OpportunitiesCollection();
            this.opportunitiesCollection.bind('reset', _.bind(this.render, this));
        },

        events: {
            "click .checkbox": "checked",
            "click .person-checkbox": "personsSalesChecked",
            "click .details": "toggle",
            "mouseover .social a": "socialActive",
            "mouseout .social a": "socialNotActive",
            "click .company": "gotoCompanyForm",
            "click #attachSubmit":"addAttach",
            "click #addNote": "addNote",
            "click .editDelNote": "editDelNote",
            "click #cancelNote": "cancelNote"
        },
        cancelNote: function(e) {
            $('#noteArea').val('');
            $('#getNoteKey').attr("value",'');
        },
        editDelNote: function(e) {
            var id = e.target.id;
            var k = id.indexOf('_');
            var type = id.substr(0,k);
            var id_int = parseInt(id.substr(k+1));

            var models = this.collection.models;
            var itemIndex = Custom.getCurrentII() - 1;
            var currentModel = models[itemIndex];
            var notes = currentModel.get('notes');

            switch (type) {
                case "edit": {
                    $('#noteArea').val($('#'+id_int).find('.noteText').text());
                    $('#getNoteKey').attr("value",id_int);
                    break;
                }
                case "del": {
                    delete notes[id_int];
                    currentModel.set('notes',notes);
                    if (currentModel.save()) {
                        $('#'+id_int).remove();
                    }
                    break;
                }
            }
        },
        addNote: function() {
            var val = $('#noteArea').val();
            if (val) {
                var models = this.collection.models;
                var itemIndex = Custom.getCurrentII() - 1;
                //TODO fix some problems with itemIndex
                var currentModel = models[itemIndex];
                var notes = currentModel.get('notes');
                var key = notes.length;
                var arr_key_str = $('#getNoteKey').attr("value");
                var note_obj = {
                    note: '',
                    date: ''
                };
                if (arr_key_str) {
                    notes[parseInt(arr_key_str)].note = val;
                    currentModel.set('notes',notes);
                    if (currentModel.save()) {
                        $('#noteArea').val($('#'+ arr_key_str ).find('.noteText').text(val));
                        $('#getNoteKey').attr("value",'');
                    }
                } else {
                    var today_date = new Date();
                    note_obj.date = today_date;
                    note_obj.note = val;
                    notes.push(note_obj);
                    currentModel.set('notes',notes);
                    if (currentModel.save()) {
                        var edit = 'edit_'+key;
                        var del = 'del_'+key;
                        var author = currentModel.get('name').first ;
                        $('#noteBody').prepend( _.template(addNoteTemplate,{key: key, val: val, edit: edit, del: del,author: author, date: today_date }));
                    }
                }
                $('#noteArea').val('');
            }
        },
        addAttach: function(){
        	var models = this.collection.models;
            var itemIndex = Custom.getCurrentII() - 1;
            var currentModel = models[itemIndex]["id"];
        	//event.preventDefault();
        	var addFrmAttach = $("#addAttachments");
        	var addInptAttach = $("#inputAttach").serialize(); 
        	addFrmAttach.submit(function(e){
        		var formURL = addFrmAttach.attr("action");
        		e.preventDefault();
        		addFrmAttach.ajaxSubmit({
        			url:formURL,
        			type: "POST",
        			cache: false,
        			processData: false,
        			data:addInptAttach,
        		
        			
        			beforeSend: function(xhr){
        			    

	                       xhr.setRequestHeader("id",currentModel);
        			},
        			
        			success:function(data){
        				console.log('Attach file');
        			},
        			error: function (){
        				console.log("Attach file error");
        			} 
        		});
        	});

        },
        
        editItem: function(){
            //create editView in dialog here
            new EditView({collection:this.collection});
        },
        
        personsSalesChecked: function (e) {
			if ($(e.target).get(0).tagName.toLowerCase()=="span"){
				$(e.target).parent().toggleClass("active");
			}else{
				$(e.target).toggleClass("active");
			}
        },

        gotoCompanyForm: function (e) {
            e.preventDefault();
            var itemIndex = $(e.target).closest("a").attr("data-id");
            window.location.hash = "#home/content-Company/form/" + itemIndex;
        },
        toggle: function () {
            this.$('#details').animate({
                height: "toggle"
            }, 250, function () {
           
            });
        },
        socialActive: function (e) {
            e.preventDefault();           
            $(e.target).animate({
                'background-position-y':'-38px'

            }, 300, function () { });
        },
        socialNotActive: function (e) {
            e.preventDefault();
            $(e.target).animate({
                'background-position-y': '0px'

            }, 300, function () { });
        },
        render: function () {
            Custom.setCurrentCL(this.collection.length);
            console.log('Render Persons View');
            var viewType = Custom.getCurrentVT(),
                models = this.collection.models;
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate, {personsCollection:this.collection.toJSON()}));

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });
                        break;
                    }
                case "thumbnails":
                    {
                        this.$el.html('');
                        var holder = this.$el,
                            thumbnailsItemView;
                        _.each(models, function (model) {
                            thumbnailsItemView = new ThumbnailsItemView({ model: model });
                            thumbnailsItemView.bind('deleteEvent', this.deleteItems, thumbnailsItemView);
                            $(holder).append(thumbnailsItemView.render().el);
                        }, this);
                        break;
                    }
                case "form":
                    {
                        var itemIndex = Custom.getCurrentII() - 1;
                        if (itemIndex > models.length - 1) {
                            itemIndex = models.length - 1;
                            Custom.setCurrentII(models.length);
                        }

                        if (itemIndex == -1) {
                            this.$el.html();
                        } else {
                            var currentModel = models[itemIndex];
                            var notes = currentModel.get('notes');
                            for (var i = 0; i < notes.length; i++) {
                                if (notes[i] == null) {
                                    notes.splice(i, 1);
                                    i--;
                                }
                            }
                            currentModel.set('notes',notes);
                            currentModel.save();

                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));
                            this.$el.find('.formRightColumn').append(
                                new opportunitiesCompactContentView({
                                    collection: this.opportunitiesCollection,
                                    model: currentModel
                                }).render(true).el
                            );

                            this.$el.find('.formLeftColumn').append(
                                new noteView({
                                    model: currentModel
                                }).render().el
                            );
                        }
                        break;
                    }
            }
            return this;
        },

        checked: function () {
            if ($("input:checked").length > 0)
                $("#top-bar-deleteBtn").show();
            else
                $("#top-bar-deleteBtn").hide();
        },

        deleteItems: function () {
            var that = this,
               mid = 39,
               model,
               viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = that.collection.get(checkbox.value);
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                        });
                        this.collection.trigger('reset');
                        break;
                    }
                case "thumbnails":
                    {
                        model = this.model.collection.get(this.$el.attr("id"));
                        this.$el.fadeToggle(300, function () {
                            model.destroy({
                                headers: {
                                    mid: mid
                                }
                            });
                            $(this).remove();
                        });
                        break;
                    }
                case "form":
                    {
                        model = this.collection.get($(".form-holder form").data("id"));
                        model.on('change', this.render, this);
                        model.destroy({
                            headers: {
                                mid: mid
                            },
                            success: function () {
                                Backbone.history.navigate("#home/content-Persons", { trigger: true });
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ContentView;
});
