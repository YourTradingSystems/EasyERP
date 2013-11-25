define([
    'text!templates/Companies/list/ListTemplate.html',
    'text!templates/Companies/form/FormTemplate.html',
    'collections/Opportunities/OpportunitiesCollection',
    'collections/Persons/PersonsCollection',
    "collections/Events/EventsCollection",
    'views/Companies/thumbnails/ThumbnailsItemView',
    'views/Opportunities/compactContent',
    'views/Persons/compactContent',
    'custom',
    'common',
    'views/Notes/NoteView',
    'text!templates/Notes/AddNote.html',
    'text!templates/Notes/AddAttachments.html'

],
function (ListTemplate, FormTemplate, OpportunitiesCollection, PersonsCollection, EventsCollection, ThumbnailsItemView, opportunitiesCompactContentView, personsCompactContentView, Custom, common, noteView, addNoteTemplate, addAttachTemplate) {
    var ContentView = Backbone.View.extend({
        el: '#content-holder',
        initialize: function (options) {
            console.log('Init Companies View');
            this.collection = options.collection;
            this.opportunitiesCollection = new OpportunitiesCollection();
            this.opportunitiesCollection.bind('reset', _.bind(this.render, this));
            this.eventsCollection = new EventsCollection();
            this.eventsCollection.bind('reset', _.bind(this.render, this));
            this.personsCollection = new PersonsCollection();
            this.personsCollection.bind('reset', _.bind(this.render, this));
            this.collection.bind('reset', _.bind(this.render, this));
            //this.render();
        },
        flag: true,
        events: {
            "click .checkbox": "checked",
            "click #tabList a": "switchTab",
            "click .details": "toggle",
            "mouseover .social a": "socialActive",
            "mouseout .social a": "socialNotActive",
            "click td:not(:has('input[type='checkbox']'))": "gotoForm",
            "click #attachSubmit": "addAttach",
            "click #addNote": "addNote",
            "click .editDelNote": "editDelNote",
            "click #cancelNote": "cancelNote",
            "mouseenter .editable:not(.quickEdit)": "quickEdit",
            "mouseleave .editable": "removeEdit",
            "click #editSpan": "editClick",
            "click #cancleSpan": "cancleClick",
            "click #saveSpan": "saveClick"
        },

        quickEdit: function (e) {
            // alert(e.target.id);
            $("#" + e.target.id).append('<span id="editSpan" class=""><a href="#">Edit</a></span>');
        },

        removeEdit: function (e) {           
            $('#editSpan').remove();
        },
        cancleClick: function (e) {
            e.preventDefault();
            var parent = $(e.target).parent().parent();
            $("#" + parent[0].id).removeClass('quickEdit');
            $("#" + parent[0].id).text(this.text);
            $('#editInput').remove();
            $('#cancleSpan').remove();
            $('#saveSpan').remove();
        },

        editClick: function (e) {
            e.preventDefault();
            var parent = $(e.target).parent().parent();           
            $("#" + parent[0].id).addClass('quickEdit');
            this.text = $.trim($('#' + parent[0].id).data('text'));
            $("#" + parent[0].id).text('');
            $("#" + parent[0].id).append('<input id="editInput" type="text" class="left"/>');
            $('#editInput').val(this.text);
            $('#editInput').val(this.text);
            $('#editSpan').remove();
            $("#" + parent[0].id).append('<span id="cancleSpan" class="right"><a href="#">Cancle</a></span>');
            $("#" + parent[0].id).append('<span id="saveSpan" class="right"><a href="#">Save</a></span>');
        },

        saveClick: function (e) {
            e.preventDefault();
            var models = this.collection.models;
            var parent = $(event.target).parent().parent();
            var objIndex = parent[0].id.split('_');
            //console.log(objIndex);
            var obj = {};
            var itemIndex = Custom.getCurrentII() - 1;
            var currentModel = models[itemIndex];
            if (objIndex.length > 1) {             
                obj = currentModel.get(objIndex[0]);
                console.log(obj);
                obj[objIndex[1]] = $('#editInput').val();
            } else if (objIndex.length == 1) {
                obj[objIndex[0]] = $('#editInput').val();
            }           
            currentModel.set(obj);
            currentModel.save({}, {
                headers: {
                    mid: 39
                },
                success: function () {
                    Backbone.history.navigate("#home/content-Companies/form", { trigger: true });
                }
            });
        },


        cancelNote: function (e) {
            $('#noteArea').val('');
            $('#noteTitleArea').val('');
            $('#getNoteKey').attr("value", '');
        },
        editDelNote: function (e) {
            var id = e.target.id;
            var k = id.indexOf('_');
            var type = id.substr(0, k);
            var id_int = parseInt(id.substr(k + 1));

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
                    	if(note.id != id_int){
                    		return note;
                    	}
                    });
                    console.log(new_notes);
                    currentModel.set('notes',new_notes);
                    currentModel.save({},
                         {
                             headers: {
                                 mid: 39
                             },
                             success: function (model, response, options) {
                                 $('#' + id_int).remove();
                             }
                         });
                    break;
                }
            }
        },

        addNote: function () {
            var val = $('#noteArea').val();
            var title = $('#noteTitleArea').val();
            if (val || title) {
                var models = this.collection.models;
                var itemIndex = Custom.getCurrentII() - 1;
                //TODO fix some problems with itemIndex
                var currentModel = models[itemIndex];
                var notes = currentModel.get('notes');
                var key = notes.length;
                var arr_key_str = $('#getNoteKey').attr("value");
                var note_obj = {
                    note: '',
                    date: '',
                    title: ''
                };
                if (arr_key_str) {
                    notes[parseInt(arr_key_str)].note = val;
                    notes[parseInt(arr_key_str)].title = title;

                    currentModel.set('notes', notes);
                    if (currentModel.save()) {
                        $('#noteArea').val($('#' + arr_key_str).find('.noteText').text(val));
                        $('#noteTitleArea').val($('#' + arr_key_str).find('.noteTitle').text(title));
                        $('#getNoteKey').attr("value", '');
                    }
                } else {
                    var today_date = new Date();
                    note_obj.date = today_date;
                    note_obj.note = val;
                    note_obj.title = title;

                    notes.push(note_obj);
                    currentModel.set('notes', notes);
                    if (currentModel.save()) {
                        var edit = 'edit_' + key;
                        var del = 'del_' + key;
                        var author = currentModel.get('name').first;
                        $('#noteBody').prepend(_.template(addNoteTemplate, { key: key, val: val, title: title, edit: edit, del: del, author: author, date: today_date }));
                    }
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

                    success: function (data) {
                        var attachments = currentModel.get('attachments');
                        var key = attachments.length;
                        attachments.push(data);
                        currentModel.set('attachments', attachments);

                        if (currentModel.save()) {
                            $('.attachContainer').prepend(_.template(addAttachTemplate, { data: data, key: key }));
                            console.log('Attach file');
                            addFrmAttach[0].reset();
                        }
                    },

                    error: function () {
                        console.log("Attach file error");
                    },
                });
            });
            addFrmAttach.submit();
            addFrmAttach.off('submit');
        },

        deleteAttach: function (e) {
            var id = e.target.id;
            var k = id.indexOf('_');
            var id_int = parseInt(id.substr(k + 1));
            var models = this.collection.models;
            var itemIndex = Custom.getCurrentII() - 1;
            var currentModel = models[itemIndex];
            var attachments = currentModel.get('attachments');
            delete attachments[id_int];
            currentModel.set('attachments', attachments);
            if (currentModel.save()) {
                var attachments = currentModel.get('attachments');
                for (var i = 0; i < attachments.length; i++) {
                    if (attachments[i] == null) {
                        attachments.splice(i, 1);
                        i--;
                    }
                }

                currentModel.set('attachments', attachments);
                currentModel.save();
                $('.attachFile_' + id_int).remove();
            }
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
                'background-position-y': '-38px'

            }, 300, function () { });
        },
        socialNotActive: function (e) {
            e.preventDefault();
            $(e.target).animate({
                'background-position-y': '0px'

            }, 300, function () { });
        },
        switchTab: function (e) {
            e.preventDefault();
            var link = this.$("#tabList a");
            if (link.hasClass("selected")) {
                link.removeClass("selected");
            }
            var index = link.index($(e.target).addClass("selected"));
            this.$(".tab").hide().eq(index).show();
        },

        gotoForm: function (e) {
            App.ownContentType = true;
            var itemIndex = $(e.target).closest("tr").data("index");
            window.location.hash = "#home/content-Companies/form/" + itemIndex;
        },
        render: function () {
            console.log('Render Companies View');
            var viewType = Custom.getCurrentVT(),
                models = this.collection.models;
            Custom.setCurrentCL(models.length);
            switch (viewType) {
                case "list":
                    {
                        this.$el.html(_.template(ListTemplate, { companiesCollection: this.collection.toJSON() }));

                        $('#check_all').click(function () {
                            var c = this.checked;
                            $(':checkbox').prop('checked', c);
                        });

                        break;
                    }
                case "thumbnails":
                    {
                        this.$el.html('');
                        var holder = this.$el;
                        var thumbnailsItemView;
                        _.each(models, function (model) {
                            var address = model.get('address');
                            if (address.city && address.country && this.flag == true) {
                                console.log(this.flag);
                                //console.log(address.country);
                                address.city = address.city + ", ";
                                //console.log(address.city);
                                model.set({ address: address }, { silent: true });
                                this.flag = false;
                            }
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
                        }
                        else {
                            var currentModel = models[itemIndex];
                            this.$el.html(_.template(FormTemplate, currentModel.toJSON()));

                            this.$el.find('.formRightColumn').append(
                                new opportunitiesCompactContentView({
                                    collection: this.opportunitiesCollection,
                                    companiesCollection: this.collection,
                                    model: currentModel
                                }).render().el,
                                new personsCompactContentView({
                                    collection: this.personsCollection,
                                    model: currentModel
                                }).render().el
                            );

                            this.$el.find('.formLeftColumn').append(
                                    new noteView({
                                        model: currentModel
                                    }).render().el
                                ); console.log(currentModel);
                        }

                        break;
                    }
            }
            $(holder).append('<div class="clearfix"></div>');
            return this;

        },

        checked: function () {
            if (this.collection.length > 0) {
                if ($("input:checked").length > 0)
                    $("#top-bar-deleteBtn").show();
                else
                    $("#top-bar-deleteBtn").hide();
            }
        },

        deleteItems: function () {
            var self = this,
                mid = 39,
                model,
                viewType = Custom.getCurrentVT();
            switch (viewType) {
                case "list":
                    {
                        $.each($("tbody input:checked"), function (index, checkbox) {
                            model = self.collection.get(checkbox.value);

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
                            model.destroy(
                                {
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
                                Backbone.history.navigate("#home/content-Companies", { trigger: true });
                            }
                        });
                        break;
                    }
            }
        }
    });

    return ContentView;
});
