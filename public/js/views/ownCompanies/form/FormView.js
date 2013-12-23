define([
    'text!templates/ownCompanies/form/FormTemplate.html',
    'views/ownCompanies/EditView',
    'collections/Opportunities/OpportunitiesCollection',
    'collections/Persons/PersonsCollection',
    'views/Opportunities/compactContent',
    'views/Persons/compactContent',
    'custom',
    'common',
    'views/Notes/NoteView',
    'text!templates/Notes/AddNote.html',
    'text!templates/Notes/AddAttachments.html'
],

    function (CompaniesFormTemplate, EditView, OpportunitiesCollection, PersonsCollection, opportunitiesCompactContentView, personsCompactContentView, Custom, common, noteView, addNoteTemplate, addAttachTemplate) {
        var FormCompaniesView = Backbone.View.extend({
            el: '#content-holder',
            initialize: function (options) {
                this.formModel = options.model;
                this.render = _.after(2, this.render);
                this.opportunitiesCollection = new OpportunitiesCollection();
                this.opportunitiesCollection.bind('reset', _.bind(this.render, this));
                this.personsCollection = new PersonsCollection();
                this.personsCollection.bind('reset', _.bind(this.render, this));
            },
            flag: true,
            events: {
                "click #tabList a": "switchTab",
                "click .details": "toggle",
                "mouseover .social a": "socialActive",
                "mouseout .social a": "socialNotActive",
                "change #inputAttach": "addAttach",
                "click .deleteAttach": "deleteAttach",
                "click #addNote": "addNote",
                "click .editDelNote": "editDelNote",
                "click #cancelNote": "cancelNote",
                "mouseenter .editable:not(.quickEdit)": "quickEdit",
                "mouseleave .editable": "removeEdit",
                "click #editSpan": "editClick",
                "click #cancelSpan": "cancelClick",
                "click #saveSpan": "saveClick"
            },
            
            render: function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(CompaniesFormTemplate, formModel));
                this.$el.find('.formRightColumn').append(
                                new opportunitiesCompactContentView({
                                    collection: this.opportunitiesCollection,
                                    companiesCollection: this.collection,
                                    model: this.formModel
                                }).render().el,
                                new personsCompactContentView({
                                    collection: this.personsCollection,
                                    model: this.formModel
                                }).render().el
                            );

                this.$el.find('.formLeftColumn').append(
                        new noteView({
                            model: this.formModel
                        }).render().el
                    );
                return this;
            },
            
            editItem: function () {
                //create editView in dialog here
                new EditView({ model: this.formModel });
            },
            
            quickEdit: function (e) {
                // alert(e.target.id);
                $("#" + e.target.id).append('<span id="editSpan" class=""><a href="#">Edit</a></span>');
            },
            
            removeEdit: function (e) {
                $('#editSpan').remove();
            },
            
            cancelClick: function (e) {
                e.preventDefault();

                var parent = $(e.target).parent().parent();
                $("#" + parent[0].id).removeClass('quickEdit');
                $("#" + parent[0].id).text(this.text);
                $('#editInput').remove();
                $('#cancelSpan').remove();
                $('#saveSpan').remove();
                var currentModel = this.collection.getElement();

                Backbone.history.navigate("#home/content-Companies/form/" + currentModel.id, { trigger: true });
            },

            editClick: function (e) {
                e.preventDefault();

                $('.quickEdit #editInput').remove();
                $('.quickEdit #cancelSpan').remove();
                $('.quickEdit #saveSpan').remove();
                $('.quickEdit').text(this.text).removeClass('quickEdit');

                var parent = $(e.target).parent().parent();
                $("#" + parent[0].id).addClass('quickEdit');
                $('#editSpan').remove();
                this.text = $('#' + parent[0].id).text();
                $("#" + parent[0].id).text('');
                $("#" + parent[0].id).append('<input id="editInput" type="text" class="left"/>');
                $('#editInput').val(this.text);

                $("#" + parent[0].id).append('<span id="cancelSpan" class="right"><a href="#">Cancel</a></span>');
                $("#" + parent[0].id).append('<span id="saveSpan" class="right"><a href="#">Save</a></span>');
            },

            saveClick: function (e) {
                e.preventDefault();

                var parent = $(event.target).parent().parent();
                var objIndex = parent[0].id.split('_');
                var obj = {};
                var currentModel = this.collection.getElement();
                if (objIndex.length > 1) {
                    obj = currentModel.get(objIndex[0]);
                    obj[objIndex[1]] = $('#editInput').val();
                    console.log(obj);
                } else if (objIndex.length == 1) {
                    obj[objIndex[0]] = $('#editInput').val();
                    console.log(obj);
                }
                this.text = $('#editInput').val();
                $("#" + parent[0].id).text(this.text);
                $("#" + parent[0].id).removeClass('quickEdit');
                $('#editInput').remove();
                $('#cancelSpan').remove();
                $('#saveSpan').remove();
                currentModel.set(obj);

                currentModel.save({}, {
                    headers: {
                        mid: 39
                    },
                    success: function () {
                        //Backbone.history.navigate("#home/content-Companies/form/" + currentModel.id, { trigger: true });
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
                var id_int = id.substr(k + 1);


                var currentModel = this.collection.getElement();
                var notes = currentModel.get('notes');

                switch (type) {
                    case "edit": {
                        $('#noteArea').val($('#' + id_int).find('.noteText').text());
                        $('#noteTitleArea').val($('#' + id_int).find('.noteTitle').text());
                        $('#getNoteKey').attr("value", id_int);
                        break;
                    }
                    case "del": {

                        var new_notes = _.filter(notes, function (note) {
                            if (note._id != id_int) {
                                return note;
                            }
                        });
                        currentModel.set('notes', new_notes);
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
                    var currentModel = this.collection.getElement();
                    var notes = currentModel.get('notes');
                    var arr_key_str = $('#getNoteKey').attr("value");
                    var note_obj = {
                        note: '',
                        title: ''
                    };
                    if (arr_key_str) {
                        var edit_notes = _.filter(notes, function (note) {
                            if (note._id == arr_key_str) {
                                note.note = val;
                                note.title = title;
                                return note;
                            }
                        });
                        currentModel.save({},
                                   {
                                       headers: {
                                           mid: 39
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
                                            var key = notes.length - 1;
                                            var notes_data = response.notes;
                                            var date = common.utcDateToLocaleDate(response.notes[key].date);
                                            var author = currentModel.get('name').first;
                                            var id = response.notes[key]._id;

                                            $('#noteBody').prepend(_.template(addNoteTemplate, { val: val, title: title, author: author, data: notes_data, date: date, id: id }));

                                        }
                                    });

                    }
                    $('#noteArea').val('');
                    $('#noteTitleArea').val('');
                }
            },

            addAttach: function (event) {
                event.preventDefault();
                var currentModel = this.formModel;
                var currentModelID = currentModel["id"];
                var addFrmAttach = $("#addAttachments");
                var addInptAttach = $("#inputAttach")[0].files[0];
                if(!this.fileSizeIsAcceptable(addInptAttach)){
                    alert('File you are trying to attach is too big. MaxFileSize: ' + App.File.MaxFileSizeDisplay);
                    return;
                }
                addFrmAttach.submit(function (e) {
                    var bar = $('.bar');
                    var status = $('.status');
                    
                    var formURL = "http://" + window.location.host + "/uploadFiles";
                    e.preventDefault();
                    addFrmAttach.ajaxSubmit({
                        url: formURL,
                        type: "POST",
                        processData: false,
                        contentType: false,
                        data: [addInptAttach],

                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("id", currentModelID);
                            status.show();
                            var statusVal = '0%';
                            bar.width(statusVal);
                            status.html(statusVal);
                        },
                        
                        uploadProgress: function(event, position, total, statusComplete) {
                            var statusVal = statusComplete + '%';
                            bar.width(statusVal);
                            status.html(statusVal);
                        },
                         
                        success: function (data) {
                            var attachments = currentModel.get('attachments');
                            var date = common.utcDateToLocaleDate(data.uploadDate);
                            attachments.push(data);
                            $('.attachContainer').prepend(_.template(addAttachTemplate, { data: data, date: date }));
                            console.log('Attach file');
                            addFrmAttach[0].reset();
                            status.hide();
                        },

                        error: function () {
                            console.log("Attach file error");
                        }
                    });
                });
                addFrmAttach.submit();
                addFrmAttach.off('submit');
            },
            fileSizeIsAcceptable: function(file){
                if(!file){return false;}
                return file.size < App.File.MAXSIZE;
            },
            deleteAttach: function (e) {
                var id = e.target.id;
                var currentModel = this.formModel;
                var attachments = currentModel.get('attachments');
                var new_attachments = _.filter(attachments, function (attach) {
                    if (attach._id != id) {
                        return attach;
                    }
                });
                currentModel.set('attachments', new_attachments);
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

            deleteItems: function () {
                var mid = 39;
                   
                this.formModel.destroy({
                    headers: {
                        mid: mid
                    },
                    success: function () {
                        Backbone.history.navigate("#easyErp/ownCompanies/list", { trigger: true });
                    }
                });

            }
        });

        return FormCompaniesView;
    });