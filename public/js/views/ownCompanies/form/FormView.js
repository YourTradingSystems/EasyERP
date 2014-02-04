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
    'views/Opportunities/CreateView',
    'views/Persons/CreateView',
    'text!templates/Notes/AddAttachments.html'
],

    function (CompaniesFormTemplate, EditView, OpportunitiesCollection, PersonsCollection, opportunitiesCompactContentView, personsCompactContentView, Custom, common, noteView, addNoteTemplate,CreateViewOpportunities,CreateViewPersons, addAttachTemplate) {
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
                "click #saveSpan": "saveClick",
                "click .btnHolder .add.opportunities": "addOpportunities",
                "click .btnHolder .add.persons": "addPersons",
                "change .person-info.company.long input": "saveCheckboxChange"
            },
            
            render: function () {
                var formModel = this.formModel.toJSON();
                this.$el.html(_.template(CompaniesFormTemplate, formModel));
                this.$el.find('.formRightColumn').append(
                                new opportunitiesCompactContentView({
                                    collection: this.opportunitiesCollection,
                                    companiesCollection: this.collection,
                                    personsCollection: this.personsCollection,
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
            
            addOpportunities: function (e) {
            	e.preventDefault();
            	var model = this.formModel.toJSON();
            	new CreateViewOpportunities({model:model});
            },
            
            addPersons: function (e) {
            	e.preventDefault();
            	var model = this.formModel.toJSON();
            	new CreateViewPersons({model:model});
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
                var currentModel = this.model;
                Backbone.history.navigate("#easyErp/Companies/form/" + currentModel.id, { trigger: true });
            },
            
			saveCheckboxChange:function(e){
                var parent = $(e.target).parent();
                var objIndex = parent[0].id.split('_');
                var obj = {};
                var currentModel = this.model;

                if ((objIndex.length > 1) && $("#" + parent[0].id).hasClass('with-checkbox')){
                    obj = this.formModel.get(objIndex[0]);
                    obj[objIndex[1]] = ($("#" + parent[0].id + " input").prop("checked"));
					this.formModel.set(obj);
					this.formModel.save({}, {
						headers: {
							mid: 39
						},
						success: function () {
							Backbone.history.navigate("#easyErp/Companies/form/" + currentModel.id, { trigger: true });
						}
					});
				}
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
                var objIndex = parent[0].id.replace('_','.');
                var obj = {};
                var currentModel = this.model;
                obj[objIndex] = $('#editInput').val();

                this.text = $('#editInput').val();
                $("#" + parent[0].id).text(this.text);
                $("#" + parent[0].id).removeClass('quickEdit');
                $('#editInput').remove();
                $('#cancelSpan').remove();
                $('#saveSpan').remove();
                this.formModel.save(obj, {
                    headers: {
                        mid: 39
                    },
					patch:true,
                    success: function () {
                        Backbone.history.navigate("#easyErp/Companies/form/" + currentModel.id, { trigger: true });
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
                 var currentModel = this.formModel;
                 var notes = currentModel.get('notes');

                 switch (type) {
                     case "edit": {
                         $('#noteArea').val($('#' + id_int).find('.noteText').text());
                         $('#noteTitleArea').val($('#' + id_int).find('.noteTitle').text());
                         $('#getNoteKey').attr("value", id_int);
                         break;
                     }
                     case "del": {
                         var newNotes = _.filter(notes, function (note) {
                             if (note._id != id_int) {
                                 return note;
                             }
                         });
                         currentModel.save({ 'notes': newNotes },
                                 {
                                     headers: {
                                         mid: 39
                                     },
                                     patch: true,
                                     success: function () {
                                         $('#' + id_int).remove();
                                     }
                                 });
                         break;
                     }
                 }
            },

            addNote: function (e) {
            	 e.preventDefault();
                 var val = $('#noteArea').val().replace(/</g, "&#60;").replace(/>/g, "&#62;");
                 var title = $('#noteTitleArea').val().replace(/</g, "&#60;").replace(/>/g, "&#62;");
                 if (val || title) {
                     var notes = this.formModel.get('notes');
                     var arrKeyStr = $('#getNoteKey').attr("value");
                     var noteObj = {
                         note: '',
                         title: ''
                     };
                     if (arrKeyStr) {
                         var editNotes = _.map(notes, function (note) {
                             if (note._id == arrKeyStr) {
                                 note.note = val;
                                 note.title = title;
                             }
                             return note;
                         });
                         this.formModel.save({ 'notes': editNotes },
                             {
                                 headers: {
                                     mid: 39
                                 },
                                 patch: true,
                                 success: function () {
                                     $('#noteBody').val($('#' + arrKeyStr).find('.noteText').html(val));
                                     $('#noteBody').val($('#' + arrKeyStr).find('.noteTitle').html(title));
                                     $('#getNoteKey').attr("value", '');
                                 }
                             });
                     } else {
                         noteObj.note = val;
                         noteObj.title = title;
                         notes.push(noteObj);
                         this.formModel.set();
                         this.formModel.save({ 'notes': notes },
                             {
                                 headers: {
                                     mid: 39
                                 },
                                 patch: true,
                                 success: function (models, data) {
                                     $('#noteBody').empty();
                                     data.notes.forEach(function (item) {
                                     	   var key = notes.length - 1;
                                            var notes_data = response.notes;
                                            var date = common.utcDateToLocaleDate(response.notes[key].date);
                                            var author = currentModel.get('name').first;
                                            var id = response.notes[key]._id;
                                            $('#noteBody').prepend(_.template(addNoteTemplate, { val: val, title: title, author: author, data: notes_data, date: date, id: id }));
                                     });
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
            	 var target = $(e.target);
                 if (target.closest("li").hasClass("attachFile")) {
                     target.closest(".attachFile").remove();
                 } else {
                     var id = e.target.id;
                     var currentModel = this.formModel;
                     var attachments = currentModel.get('attachments');
                     var newAttachments = _.filter(attachments, function (attach) {
                         if (attach._id != id) {
                             return attach;
                         }
                     });
                     currentModel.save({ 'attachments': newAttachments },
                         {
                             headers: {
                                 mid: 39
                             },
                             patch: true,//Send only changed attr(add Roma)
                             success: function () {
                                 $('.attachFile_' + id).remove();
                             }
                         });
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
