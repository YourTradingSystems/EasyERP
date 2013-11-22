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
    'text!templates/Notes/AddNote.html',
    'text!templates/Notes/AddAttachments.html'

], function (ListTemplate, FormTemplate, OpportunitiesCollection, ThumbnailsItemView, opportunitiesCompactContentView, Custom, common, EditView, noteView, addNoteTemplate, addAttachTemplate) {
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
            "click .deleteAttach": "deleteAttach",
            "click #addNote": "addNote",
            "click .editDelNote": "editDelNote",
            "click #cancelNote": "cancelNote",
            "click .deleteAttach": "deleteAttach",
            "click .list": "gotoForm"
        },
        gotoForm: function (e) {
            App.ownContentType = true;
            var id = $(e.target).closest("tr").data("id");
            window.location.hash = "#home/content-Persons/form/" + id;
        },
        cancelNote: function(e) {
            $('#noteArea').val('');
            $('#noteTitleArea').val('');
            $('#getNoteKey').attr("value",'');
        },
        editDelNote: function (e) {
            var id = e.target.id;
            var k = id.indexOf('_');
            var type = id.substr(0, k);
            var id_int = id.substr(k + 1);
            
            
            var models = this.collection.models;
            var itemIndex = Custom.getCurrentII() - 1;
            var currentModel = models[itemIndex];
            var notes = currentModel.get('notes');

            switch (type) {
                case "edit": {
                	$('#noteArea').val($('#' + id_int).find('.noteText').text());
                    $('#noteTitleArea').val($('#' + id_int).find('.noteTitle').text());
                    $('#getNoteKey').attr("value", id_int);
                    break;
                }
                case "del": {
                  	 
                    var new_notes = _.filter(notes, function(note){
                    	if(note._id != id_int){
                    		return note;
                    	}
                    });
                    currentModel.set('notes',new_notes);
                    currentModel.save({},
                            {
                                headers: {
                                    mid: 39,
                                    remove: true
                                },
                                success: function (model, response, options) {
                                	console.log(response);
                                    $('#' + id_int).remove();
                                }
                            });
                    break;
                }
            }
        },

        addNote: function (e) {
            var val = $('#noteArea').val();
            var title = $('#noteTitleArea').val();
            if (val || title) {
                var models = this.collection.models;
                var itemIndex = Custom.getCurrentII() - 1;
                //TODO fix some problems with itemIndex
                var currentModel = models[itemIndex];
                var notes = currentModel.get('notes');
                var arr_key_str = $('#getNoteKey').attr("value");
                var note_obj = {
                	note: '',
                    title: ''
                };
                if (arr_key_str) {
                	var edit_notes = _.filter(notes, function(note){
                     	if(note._id == arr_key_str){
                     		note.note = val;
                     		note.title = title;
                     		return note;
                     	}
                     });
                 currentModel.save({},
                            {
                                headers: {
                                    mid: 39,
                                    remove: true
                                },
                                success: function (model, response, options) {
                                    $('#noteBody').val($('#' + arr_key_str).find('.noteText').text(val));
                                    $('#noteBody').val($('#' + arr_key_str).find('.noteTitle').text(title));
                                    $('#getNoteKey').attr("value", '');
                                }
                            });
             	
                	
                	
                } else {
                    
                	note_obj.note = val;
                    note_obj.title = title;
                    notes.push(note_obj);
                    currentModel.set('notes', notes);
                    currentModel.save({},
                            	{
                                headers: {
                                    mid: 39
                                },
                                success: function (model, response, options) {
                                	var key = notes.length-1;
                                	var notes_data = response.notes;
                                	var date = response.notes[key].date;
                                    var author = currentModel.get('name').first;
                                	var id = response.notes[key]._id;
                                    
                                	$('#noteBody').prepend(_.template(addNoteTemplate, {val: val, title: title, author: author,data:notes_data,date:date,id:id}));

                                }
                            });

                }
                $('#noteArea').val('');
                $('#noteTitleArea').val('');
            }
        },

        addAttach: function (event) {
            event.preventDefault();
            var models = this.collection.models;
            var itemIndex = Custom.getCurrentII() - 1;
            var currentModel = models[itemIndex];
            var currentModelID = models[itemIndex]["id"];
            var addFrmAttach = $("#addAttachments");
            var addInptAttach = $("#inputAttach")[0].files[0];
            addFrmAttach.submit(function (e) {

                var formURL = addFrmAttach.attr("action");
                e.preventDefault();
                addFrmAttach.ajaxSubmit({
                    url: formURL,
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: [addInptAttach],
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("id", currentModelID);
                    },

                    success:function(data){
        				var attachments = currentModel.get('attachments');
        				var key = attachments.length;
        				attachments.push(data);
        				$('.attachContainer').prepend( _.template(addAttachTemplate,{ data:data,key:key }));
        				console.log('Attach file');
        				addFrmAttach[0].reset();
        			},

                    error: function () {
                        console.log("Attach file error");
                    }
                });
            });
            addFrmAttach.submit();
            addFrmAttach.off('submit');
        },

        deleteAttach:function(e) {
            var id = e.target.id;
            var models = this.collection.models;
            var itemIndex = Custom.getCurrentII() - 1;
            var currentModel = models[itemIndex];
            var attachments = currentModel.get('attachments');   
            var new_attachments = _.filter(attachments, function(attach){
            	if(attach._id != id){
            		return attach;
            	}
            });
            currentModel.set('attachments',new_attachments);
            currentModel.save({},
                    {
		                headers: {
		                    mid: 39
		                },
                    	
                        	success: function (model, response, options) {
                        		$('.attachFile_' + id).remove();
                        }
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
            //Custom.setCurrentCL(this.collection.length);
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
                        var currentModel = this.collection.getElement();
                        if (!currentModel) {
                            this.$el.html('<h2>No projects found</h2>');
                        } else {
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
